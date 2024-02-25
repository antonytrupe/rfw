import EventEmitter from "events"
import GameEngine from "@/GameEngine"
import ClassPopulation from "./types/ClassPopulation"
import * as CONSTANTS from "@/types/CONSTANTS"
import Character from "@/types/Character"
import { Server, Socket } from "socket.io"
import { Zones2 } from "./types/Zones"
import { getSession } from "next-auth/react"
import Player from "./types/Player"
import { v4 as uuidv4 } from 'uuid'
import { getRandomPoint, roll } from "./utility"
import GameEvent from "./types/GameEvent"
import * as CLASSES from "./types/CLASSES.json"
import * as LEVELS from "./types/LEVELS.json"
import Point from "./types/Point"
import WorldObject from "./types/WorldObject"
import { ZONETYPE } from "./types/ZONETYPE"
import { SHAPE } from "./types/SHAPE"
import { Datastore, PropertyFilter } from '@google-cloud/datastore'
import { COMMUNITY_SIZE } from "./types/CommunitySize"
import { adjectives, colors, names, uniqueNamesGenerator } from "unique-names-generator"
import { quests } from "./types/Quest"
import { ViewPort } from "./types/Viewport"

export default class ServerEngine {
    getActiveCharacters() {
      return this.gameEngine.getActiveCharacters()
    }

    private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    private gameEngine: GameEngine
    private io: Server
    private templates: Map<string, WorldObject> = new Map()
    private datastore: Datastore
    private playersByEmail: Map<string, Player> = new Map()
    private playersById: Map<string, Player> = new Map()

    constructor(io: Server) {
        this.io = io
        const eventEmitter: EventEmitter = new EventEmitter()
        this.gameEngine = new GameEngine({ fps: 32 }, eventEmitter)
        this.on = eventEmitter.on.bind(eventEmitter)

        this.connect()
        this.loadWorld()

        this.setUpListeners()

        this.setUpSocket()

        //start the gameengine
        this.start()
    }

    connect() {
        this.datastore = new Datastore({ projectId: 'rfw2-403802' })
    }

    setUpListeners() {
        //updated characters from the gameengine running on the server
        this.on(CONSTANTS.SERVER_CHARACTER_UPDATE, (characters: string[]) => {
            //console.log('serverengine SERVER_CHARACTER_UPDATE')
            this.sendAndSaveCharacterUpdates(characters)
        })
    }

    setUpSocket() {

        this.io.on(CONSTANTS.CONNECTION, async (socket: Socket) => {
            //console.log('CONSTANTS.CONNECTION', socket.id) 
            let player: Player | undefined
            getSession({ req: socket.conn.request, }).then(async (session) => {
                //console.log(session)
                if (!!session?.user?.email) {
                    player = await this.getPlayerByEmail(session?.user?.email)
                    //console.log(player)
                    if (!player) {
                        player = await this.savePlayer({ email: session.user.email, id: uuidv4() })
                        this.playersByEmail.set(player.email, player)
                        this.playersById.set(player.id, player)
                    }
                    console.log(player.email, 'joined')
                    //console.log(player)
                    socket.join(player.id)

                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                    //send the players characters
                    if (player.claimedCharacters) {
                        const chars = this.gameEngine.getCharacters(player.claimedCharacters)
                        socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, chars)
                    }
                    //send the quest list
                    socket.emit(CONSTANTS.QUESTS, quests)
                }
            })

            //CONSTANTS.CHAT
            socket.on(CONSTANTS.CHAT, async (event: GameEvent) => {
                //console.log('CONSTANTS.CHAT', event)
                console.log('event.message', event.message![0])
                const target = this.gameEngine.getCharacter(event.target)
                target.events.push(event)
                //console.log('event.message[0]', event?.message[0]) 
                socket.broadcast.emit(CONSTANTS.CHAT, event)
            })

            //tell the client where all the character are
            //client is 
            socket.on(CONSTANTS.CLIENT_VIEWPORT, (viewPort: ViewPort) => {
                //console.log('CLIENT_VIEWPORT')
                //console.log('viewport', (viewPort.right - viewPort.left) * (viewPort.bottom - viewPort.top))
                const started = (new Date()).getTime()

                const brandNewZones = this.updateZones(socket, viewPort, player)

                const characters = this.gameEngine.gameWorld.getCharactersInZones(brandNewZones)
                const worldObjects = this.gameEngine.gameWorld.getObjectsInZones(brandNewZones)
                //console.log('socket.rooms', socket.rooms.size)
                //only send characters the client didn't already have in its old viewport
                if (characters.length > 0) {
                    socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, characters.map((character) => {
                        //const { matterId, ...c } = character
                        return character
                    }))
                }
                if (worldObjects.length > 0) {
                    socket.emit(CONSTANTS.WORLD_OBJECTS, worldObjects)
                }
                if (this.templates.size > 0) {
                    socket.emit(CONSTANTS.TEMPLATE_OBJECTS, Array.from(this.templates.entries()))
                }
                const finished = (new Date()).getTime()
                if (finished - started > 5) {
                    //console.log('CLIENT_VIEWPORT duration', finished - started)
                }
            })

            socket.on(CONSTANTS.CONTROL_CHARACTER, async (characterId: string | undefined) => {
                //console.log('serverengine controlcharacter', characterId)
                //console.log('player', player)
                if (!!player && characterId != undefined) {
                    [player,] = await this.controlCharacter(characterId, player?.email)
                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                    //TODO send character update
                }
                else {
                    console.log('bailing on control character, no session')
                }
            })

            socket.on(CONSTANTS.CREATE_CHARACTER, () => {
                const character = this.createCharacter({ characterClass: "FIGHTER", level: 6 })
                this.sendAndSaveCharacterUpdates([character.id])
            })

            socket.on(CONSTANTS.CREATE_OBJECT, () => {
                const object = this.createObject()
                //this.sendObjects()
            })

            socket.on(CONSTANTS.ATTACK, async (attacker: string, attackee: string) => {
                if (attackee) {
                    this.addAttackAction(attacker, attackee)
                }
                else {
                    this.removeAttackAction(attacker)
                }
            })

            socket.on(CONSTANTS.TURN_LEFT, async (characterId: string) => {
                this.turnLeft(characterId, player)
            })

            socket.on(CONSTANTS.TURN_RIGHT, async (characterId: string) => {
                this.turnRight(characterId, player)
            })

            socket.on(CONSTANTS.TURN_STOP, async (characterId: string) => {
                this.turnStop(characterId, player)
            })

            socket.on(CONSTANTS.STOP_ACCELERATE, async (characterId: string) => {
                this.accelerateStop(characterId, player)
            })

            socket.on(CONSTANTS.ACCELERATE, async (characterId: string) => {
                this.accelerate(characterId, player)
            })

            socket.on(CONSTANTS.DECELERATE, async (characterId: string) => {
                this.decelerate(characterId, player)
            })

            socket.on(CONSTANTS.ACCELERATE_DOUBLE, async (characterId: string) => {
                this.accelerateDouble(characterId, player)
            })

            socket.on(CONSTANTS.STOP_DOUBLE_ACCELERATE, async (characterId: string) => {
                this.accelerateDoubleStop(characterId, player)
            })

            socket.on(CONSTANTS.MOVE_TO, async (characterId: string, location: Point) => {
                this.addMoveAction(characterId, location)
            })

            socket.on(CONSTANTS.CAST_SPELL, async ({ casterId: casterId, spellName: spellName, targets: targets }) => {
                //console.log('spellName',spellName)
                //console.log('casterId',casterId)
                //console.log('targets',targets)
                const updatedCharacters = this.gameEngine.castSpell(casterId, spellName, targets)
                //console.log(updatedCharacters)
                this.io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, updatedCharacters)
            })

            socket.on(CONSTANTS.SPAWN_COMMUNITY, async (options: { size: COMMUNITY_SIZE, race: string, location: Point }) => {
                //console.log('options', options)
                //console.log('location', location)
                //console.log('targets',targets) 
                this.spawnCommunity(options)
            })

            socket.on(CONSTANTS.CLAIM_CHARACTER, async (characterId: string) => {
                if (!!player) {
                    [player,] = await this.claimCharacter(characterId, player.email)
                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                    //TODO send character update
                }
                else {
                    console.log('bailing on claim character, no session')
                }
            })

            socket.on(CONSTANTS.UNCLAIM_CHARACTER, async (characterId: string) => {
                if (!!player) {
                    [player,] = await this.unClaimCharacter(characterId, player.email)
                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                    //TODO send character update
                }
                else {
                    console.log('bailing on unclaim character, no session')
                }
            })

            socket.on(CONSTANTS.DISCONNECT, (reason: string) => {
                console.log('CONSTANTS.DISCONNECT', reason)
            })
        })
    }

    updateZones(socket: Socket, viewPort: ViewPort, player: Player | undefined) {
        //join the right zones/rooms
        let oldZones = socket.rooms
        //TODO switch to bigger zones if we're zoomed out a bunch
        let newZones = this.gameEngine.getZonesIn(viewPort)
        //leave zones we shouldn't be in
        oldZones.forEach((zone) => {
            if (!newZones.includes(zone) && zone != player?.id) {
                //console.log('leaving a room')
                socket.leave(zone)
            }
        })
        //get the list of newZones that aren't in oldZones
        const brandNewZones = new Set<string>()
        newZones.forEach((zone) => {
            if (!Array.from(oldZones).includes(zone)) {
                socket.join(zone)
                brandNewZones.add(zone)
            }
        })
        return brandNewZones
    }

    async createObject(wo?: WorldObject) {
        const id = uuidv4()
        let o = new WorldObject({ id, ...wo })
        this.saveObject(o)
        this.gameEngine.updateObjects([o])
    }

    async saveObject(newObject: WorldObject) {
        const kind = CONSTANTS.OBJECT_KIND
        // The name/ID for the new entity
        const name = newObject.id
        // The Cloud Datastore key for the new entity
        const taskKey = this.datastore.key([kind, name])
        // Prepares the new entity
        const task = {
            key: taskKey,
            data: newObject,
        }
        // Saves the entity
        this.datastore.save(task)
    }

    addMoveAction(characterId: string, location: Point) {
        //console.log('addMoveAction')
        this.gameEngine.addMoveAction(characterId, location)
        this.sendAndSaveCharacterUpdates([characterId])
    }

    removeAttackAction(attackerId: string) {
        this.gameEngine.removeAttackAction(attackerId)
    }

    async savePlayer(player: Partial<Player>): Promise<Player> {
        // The name/ID for the new entity
        if (!player.email) {
            throw new Error('no email for player')
        }

        if (!player.id) {
            player.id = uuidv4()
        }

        // The Cloud Datastore key for the new entity
        const key = this.datastore.key([CONSTANTS.PLAYER_KIND, player.email])
        //console.log(1)
        // Prepares the new entity
        const d = {
            key: key,
            data: new Player(player),
        }
        //console.log(2)

        // Saves the entity
        await this.datastore.save(d)
        //console.log(3)

        //console.log(d.data)

        this.playersByEmail.set(d.data.email, d.data)
        this.playersById.set(d.data.id, d.data)

        return d.data
    }

    deletePlayers(playerIds: string[]) {
        playerIds.forEach((id) => {
            this.deletePlayer(id)
        })
    }

    deletePlayer(playerId: string) {
        const p = this.playersById.get(playerId)
        if (!!p) {
            this.playersByEmail.delete(p.email)
            this.playersById.delete(p.id)
            this.datastore.delete(this.datastore.key([CONSTANTS.PLAYER_KIND, p.email]))
        }
    }

    getAllPlayers(): Player[] {
        return Array.from(this.playersById.values())
    }

    async getPlayerByEmail(email: string): Promise<Player | undefined> {
        //console.log('getPlayerByEmail')

        // look up from memory first before going to persistance
        let player: Player | undefined = this.playersByEmail.get(email)

        //didn' find it it memory
        if (!player) {
            //look for it in datastore
            const playerQuery = this.datastore.createQuery(CONSTANTS.PLAYER_KIND)
            playerQuery.filter(new PropertyFilter('email', '=', email))
            const [players]: [Player[], any] = await this.datastore.runQuery(playerQuery)

            player = players[0]
            //if we found it in the datastore
            if (!!player) {
                //put it in memory
                this.playersByEmail.set(player.email, player)
                this.playersById.set(player.id, player)
            }
        }

        let updatePlayer = false
        if (!!player?.controlledCharacter) {
            const c = this.getCharacter(player.controlledCharacter)
            if (!c) {
                player.controlledCharacter = ''
                updatePlayer = true
            }
        }
        if (!!player?.claimedCharacters) {
            const l: string[] = []
            player.claimedCharacters.forEach((id) => {
                const c = this.getCharacter(id)
                if (!c) {
                    updatePlayer = true
                }
                else {
                    l.push(id)
                }
            })
            player.claimedCharacters = l
        }
        //console.log(player)

        if (updatePlayer) {
            player = await this.savePlayer(player)
            this.playersByEmail.set(player.email, player)
            this.playersById.set(player.id, player)
            //console.log(player)
        }

        return player
    }

    addAttackAction(attacker: string, attackee: string) {
        //console.log('serverengine.attack')
        this.gameEngine.addAttackAction(attacker, attackee, true, true)
        this.sendAndSaveCharacterUpdates([attacker, attackee])
    }

    getCharacter(id: string) {
        return this.gameEngine.getCharacter(id)
    }

    getAllCharacters() {
        return this.gameEngine.getAllCharacters()
    }

    accelerateDoubleStop(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.accelerateDoubleStop(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    accelerateDouble(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.accelerateDouble(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    decelerate(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.decelerate(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    accelerate(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.accelerate(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    accelerateStop(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.accelerateStop(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    turnStop(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.turnStop(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    turnRight(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.turnRight(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    turnLeft(characterId: string, player: Player | undefined) {
        const character = this.gameEngine.turnLeft(characterId, player?.id)
        if (!!character) {
            this.sendAndSaveCharacterUpdates([characterId])
        }
    }

    async unClaimCharacter(characterId: string, playerEmail: string): Promise<[Player | undefined, Character | undefined]> {
        if (!playerEmail) {
            console.log('bailing on unclaim character: no email')
            return [undefined, undefined]
        }

        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //bail if no player found
        if (!player) {
            return [player, undefined]
        }
        //we've got a player now
        const character = this.gameEngine.unClaimCharacter(characterId)
        //console.log('claimed character', c)

        player.claimedCharacters.splice(player.claimedCharacters.indexOf(characterId), 1)

        player = await this.savePlayer({
            email: player.email,
            claimedCharacters: player.claimedCharacters,
            //if we're unclaimed the controlled character, uncontrol it, otherwise leave the current controlled character
            controlledCharacter: player.controlledCharacter == characterId ? "" : player.controlledCharacter
        })
        this.playersByEmail.set(player.email, player)
        this.playersById.set(player.id, player)

        //tell the client it worked
        this.io.to(player.id).emit(CONSTANTS.CURRENT_PLAYER, player)
        if (character) {
            this.sendAndSaveCharacterUpdates([character.id])
        }
        return [player, character]
    }

    async claimCharacter(characterId: string, playerEmail: string): Promise<[Player | undefined, Character | undefined]> {
        if (!playerEmail) {
            //console.log('bailing on claim character: no email')
            return [undefined, undefined]
        }
        //find or create the player
        let player: Player | undefined = await this.getPlayerByEmail(playerEmail)
        //console.log(player)
        if (!player) {
            //console.log('make a new player')
            const id = uuidv4()
            player = await this.savePlayer({ email: playerEmail, id: id })
            this.playersByEmail.set(player.email, player)
            this.playersById.set(player.id, player)
        }
        //we've got a player now
        const character = this.getCharacter(characterId)
        //if we already claimed this character, then bail
        //console.log(player.claimedCharacters)
        if (player.claimedCharacters.some((c) => c == characterId)) {
            //console.log('bailing on claim character, already claimed this character')
            return [player, character]
        }
        //console.log(1)

        if (!character) {
            //console.log('bailing on claim character: no character')
            return [player, character]
        }
        //console.log(2)

        //check if the character is claimed by another player
        if (!!character.playerId) {
            //console.log('character.playerId', character.playerId)
            //console.log('bailing on claim character: claimed by another player')
            return [player, character]
        }
        //console.log(3)

        this.gameEngine.updateCharacter({ id: characterId, playerId: player.id })
        character.playerId = player.id
        //console.log(4)

        player.claimedCharacters.push(characterId)
        player = await this.savePlayer({ ...player, email: player.email, claimedCharacters: player.claimedCharacters })
        this.playersByEmail.set(player.email, player)
        this.playersById.set(player.id, player)
        //console.log(player)

        this.sendAndSaveCharacterUpdates([characterId])
        return [player, character]
    }

    async controlCharacter(characterId: string, playerEmail: string): Promise<[Player | undefined, Character | undefined]> {
        //console.log('controlCharacter')

        if (!playerEmail) {
            return [undefined, undefined]
        }

        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //console.log(player)
        if (!player) {
            //console.log('make a new player')
            const id = uuidv4()
            player = await this.savePlayer({ email: playerEmail, id: id })
            this.playersByEmail.set(player.email, player)
            this.playersById.set(player.id, player)
        }

        let character = this.getCharacter(characterId)
        if (!character) {
            return [player, character]
        }

        if (!!character.playerId && character.playerId != player.id) {
            //console.log('no stealing')
            //console.log('character.playerId', character.playerId)
            //console.log('player.id', player.id)

            return [player, character]
        }

        //claim it if possible
        if (characterId) {
            [player, character] = await this.claimCharacter(characterId, playerEmail)
        }

        player = await this.savePlayer({ ...player, controlledCharacter: characterId })
        this.playersByEmail.set(player.email, player)
        this.playersById.set(player.id, player)

        return [player, character]
    }

    private async loadWorld() {
        console.log('loading world')

        this.loadAllCharacters()

        const templateQuery = this.datastore.createQuery(CONSTANTS.TEMPLATE_KIND)
        await this.datastore.runQuery(templateQuery)
            .then(([templates]) => {
                templates.forEach((t: WorldObject) => {
                    this.templates.set(t.id, t)
                })
                //console.log('finished loading templates')
            })
            .catch((error) => {
                console.log('failed to load templates', error)
            })

        const objectQuery = this.datastore.createQuery(CONSTANTS.OBJECT_KIND)
        await this.datastore.runQuery(objectQuery)
            .then(([objects]) => {
                this.gameEngine.updateObjects(objects)
                //console.log('finished loading objects')
            })
            .catch((error) => {
                console.log('failed to load world objects', error)
            })
    }

    async loadAllCharacters() {
        const characterQuery = this.datastore.createQuery(CONSTANTS.CHARACTER_KIND)
        await this.datastore.runQuery(characterQuery)
            .then(([characters]) => {
                //console.log(characters)
                this.gameEngine.updateCharacters(characters)
                console.log('finished loading characters')
            })
            .catch((error) => {
                console.log('failed to load characters', error)
            })
    }

    updateCharacter(character: Character) {
        //console.log(character)
        return this.gameEngine.updateCharacter(character)
            .getCharacter(character.id)
    }

    //only persists, doesn't add to engine
    async saveCharacter(character: Character) {
        //console.log('saveCharacter')
        const kind = CONSTANTS.CHARACTER_KIND
        // The Cloud Datastore key for the new entity
        const key = this.datastore.key([kind, character.id])
        // Prepares the new entity

        // Saves the entity
        await this.datastore.save({
            key: key,
            data: character
        })
        return character
    }

    //loads from persistance
    async loadCharacter(id: string): Promise<Character> {
        const key = this.datastore.key([CONSTANTS.CHARACTER_KIND, id])
        const [character] = await this.datastore.get(key)
        return character
    }

    private sendAndSaveCharacterUpdates(characterIds: string[]) {
        //only send character updates to the room/zone they're in
        const a: Zones2 = this.gameEngine.gameWorld.getCharactersIntoZones(characterIds)
        //console.log(a)

        a.forEach((characters, zoneName) => {
            characters.forEach((character) => {
                //persist the character
                if (!!character) {
                    //character still exists
                    this.saveCharacter(character)
                }
                else {
                    //character doesn't exist
                    //this.io.emit(CONSTANTS.CLIENT_CHARACTER_DELETE, [id])
                    //this.worldDB.delete(CONSTANTS.CHARACTER_PATH + characerId)
                    //this.worldDB.push(CONSTANTS.TOMBSTONE_PATH + id, character)
                }
            })
            //send the zone
            this.io.to(zoneName).emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, Array.from(characters.values()))
        })
    }

    async spawnCommunity({ size, race, location }: { size: COMMUNITY_SIZE, race: string, location: Point }) {
        const started = (new Date()).getTime()
        const logging = false
        console.log('spawnCommunity')
        console.log(size)
        let modifier = -16
        let totalSize = 0
        let createdCount = 0
        let radius = 90

        switch (size.toUpperCase()) {
            case COMMUNITY_SIZE.THORP:
                modifier = -3
                totalSize = roll({ size: 60, modifier: 20 })
                break
            case COMMUNITY_SIZE.HAMLET:
                modifier = -2
                totalSize = roll({ size: 320, modifier: 80 })
                radius = 240
                break
            case COMMUNITY_SIZE.VILLAGE:
                modifier = -1
                totalSize = roll({ size: 500, modifier: 400 })
                radius = 500
                break
            case COMMUNITY_SIZE.SMALL_TOWN:
                modifier = 0
                totalSize = roll({ size: 1100, modifier: 900 })
                radius = 800
                break
            case COMMUNITY_SIZE.LARGE_TOWN:
                modifier = 3
                totalSize = roll({ size: 3000, modifier: 2000 })
                radius = 1200
                break
            case COMMUNITY_SIZE.SMALL_CITY:
                modifier = 6
                totalSize = roll({ size: 7000, modifier: 5000 })
                radius = 1500
                break
            case COMMUNITY_SIZE.LARGE_CITY:
                modifier = 9
                totalSize = roll({ size: 13000, modifier: 12000 })
                radius = 2000
                break
            case COMMUNITY_SIZE.METROPOLIS:
                modifier = 12
                totalSize = roll({ size: 75000, modifier: 25000 })
                radius = 3200
                break
        }

        //create the local zone object
        const id = uuidv4()
        const name = uniqueNamesGenerator({ dictionaries: [adjectives, colors] })

        this.createObject(new WorldObject({ id: id, name: name, location: location, zoneType: [ZONETYPE.LOCAL], shape: SHAPE.CIRCLE, radiusX: radius, physics: false }))

        if (logging) console.log('modifier', modifier)

        //pc classes
        //barbarians
        let characters = this.populateClass({
            className: 'BARBARIAN',
            race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        if (logging) console.log(characters.length, 'BARBARIAN')

        //bards
        characters = characters.concat(this.populateClass({
            className: 'BARD', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'BARD')

        //clerics 
        characters = characters.concat(this.populateClass({
            className: 'BARD', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'BARD')

        //druid
        characters = characters.concat(this.populateClass({
            className: 'DRUID', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'DRUID')

        //fighter 
        characters = characters.concat(this.populateClass({
            className: 'FIGHTER', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'FIGHTER')

        //monk 
        characters = characters.concat(this.populateClass({
            className: 'MONK', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'MONK')

        //paladin 
        characters = characters.concat(this.populateClass({
            className: 'PALADIN', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'PALADIN')

        //ranger 
        characters = characters.concat(this.populateClass({
            className: 'RANGER', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'RANGER')

        //rogue 
        characters = characters.concat(this.populateClass({
            className: 'ROGUE', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'ROGUE')

        //sorcerer 
        characters = characters.concat(this.populateClass({
            className: 'SORCERER', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'SORCERER')

        //wizard 
        characters = characters.concat(this.populateClass({
            className: 'WIZARD', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'WIZARD')

        //npc classes
        //adepts  
        characters = characters.concat(this.populateClass({
            className: 'ADEPT', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'ADEPT')

        //aristocrats
        characters = characters.concat(this.populateClass({
            className: 'ARISTOCRAT', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'ARISTOCRAT')

        //commoner 
        characters = characters.concat(this.populateClass({
            className: 'COMMONER', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'COMMONER')

        //expert 
        characters = characters.concat(this.populateClass({
            className: 'EXPERT', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'EXPERT')

        //warrior
        characters = characters.concat(this.populateClass({
            className: 'WARRIOR', race: race,
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'WARRIOR')

        const buffer = 10

        let remaining = totalSize - characters.length

        //make more level 1 characters
        //create .5% aristocrats
        for (let i = 0; i < remaining * .005; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearPoint({ location: p, distance: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "ARISTOCRAT", location: p, race: race })
            createdCount++
            characters.push(c.id)
        }
        if (logging) console.log(characters.length, 'ARISTOCRAT')

        //create .5% adepts
        for (let i = 0; i < remaining * .005; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearPoint({ location: p, distance: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "ADEPT", location: p, race: race })
            createdCount++
            characters.push(c.id)
        }
        if (logging) console.log(characters.length, 'ADEPT')

        //create 3% experts
        for (let i = 0; i < remaining * .03; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearPoint({ location: p, distance: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "EXPERT", location: p, race: race })
            createdCount++
            characters.push(c.id)
        }
        if (logging) console.log(characters.length, 'EXPERT')

        //create 5% warriors
        for (let i = 0; i < remaining * .05; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearPoint({ location: p, distance: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "WARRIOR", location: p, race: race })
            createdCount++
            characters.push(c.id)
        }
        if (logging) console.log(characters.length, 'WARRIOR')

        //console.log('createdCount before commoner fill', createdCount)

        //create the rest as commoners
        for (let i = 0; createdCount < totalSize; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearPoint({ location: p, distance: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "COMMONER", location: p, race: race })
            createdCount++
            characters.push(c.id)
        }
        //console.log('createdCount after commoner fill', createdCount)
        if (logging) console.log(characters.length, 'COMMONER')
        this.sendAndSaveCharacterUpdates(characters)

        const finished = (new Date()).getTime()
        if (finished - started > 5) {
            console.log('spawnCommunity duration', finished - started)
        }
    }

    private populateClass({ className, diceCount, diceSize, modifier, origin, radius, race }: ClassPopulation): string[] {
        let location: Point
        const buffer = 10
        let createdCharacterIds: string[] = []
        //let updatedZones = new Map<string, Set<string>>()
        const highestLevel = roll({ size: diceSize, count: diceCount, modifier: modifier })
        //console.log(className, highestLevel)
        //work our way down from highest level
        for (let l = highestLevel; l >= 1; l /= 2) {
            //console.log('level', level)
            //make the right amount of each level
            for (let i = 0; i < highestLevel / l; i++) {

                location = getRandomPoint({ origin, radius })
                while (this.gameEngine.gameWorld.getCharactersNearPoint({ location, distance: buffer }).length > 0) {
                    radius += 1
                    location = getRandomPoint({ origin, radius })
                }

                const level = Math.round(l)
                const xp = LEVELS[level.toString() as keyof typeof LEVELS]
                const c = this.createCharacter({ characterClass: className, level: level, xp: xp, location: location, race: race })
                //console.log('c', c)
                createdCharacterIds = [...createdCharacterIds, c.id]
                ///updatedZones = new Map([...updatedZones, ...zones])
            }
        }
        //console.log(updatedCharacters)
        return createdCharacterIds
    }

    //does not persist
    createCharacter(character: Partial<Character>): Character {
        const classInfo = CLASSES[character.characterClass as keyof typeof CLASSES]
        const hitDie = classInfo.HitDie
        const bab = classInfo.BAB[character.level?.toString() as keyof typeof classInfo.BAB]
        const hp = roll({ size: hitDie, count: character.level! - 1, modifier: hitDie })
        let x = roll({ size: 60, modifier: -30 })
        let y = roll({ size: 60, modifier: -30 })
        const id = uuidv4()
        const age = 30
        const name = uniqueNamesGenerator({ dictionaries: [names] })

        const c = new Character({ id: id, name: name, location: { x: x, y: y }, rotation: roll({ size: 360 }), hp: hp, maxHp: hp, bab: bab, age: age, ...character, })
        this.gameEngine.createCharacter(c)
        return c
    }

    deleteCharacter(characterId: string) {
        console.log("deleteCharacter", characterId)

        this.datastore.delete(this.datastore.key([CONSTANTS.CHARACTER_KIND, characterId]))
        this.gameEngine.deleteCharacter(characterId)
        //TODO tell the client this was deleted
    }

    deleteCharacters(characterIds: string[]) {
        console.log("deleteCharacters", characterIds)
        characterIds.forEach((id) => this.deleteCharacter(id))
        //TODO tell the client these were deleted
    }

    stop() {
        //this.stopped = true
        this.gameEngine.stop()
    }

    start() {
        this.gameEngine.start()
    }
}