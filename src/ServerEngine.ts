import EventEmitter from "events"
import GameEngine from "@/GameEngine"
import { ClassPopulation } from "./types/ClassPopulation"
import * as CONSTANTS from "@/types/CONSTANTS"
import Character from "@/types/Character"
import { Config, JsonDB } from "node-json-db"
import { Server } from "socket.io"
import { Zones2 } from "./types/Zones"
import { getSession } from "next-auth/react"
import Player from "./types/Player"
import { v4 as uuidv4 } from 'uuid'
import { getRandomPoint, roll } from "./utility"
import { GameEvent } from "./types/GameEvent"
import * as CLASSES from "./types/CLASSES.json"
import * as LEVELS from "./types/LEVELS.json"
import { Point } from "./types/Point"
import { CHARACTER_DB_PATH, OBJECT_DB_PATH, PLAYER_DB_PATH, ViewPort } from "@/types/CONSTANTS"
import WorldObject from "./types/WorldObject"

export default class ServerEngine {
    private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    private emit: (eventName: string | symbol, ...args: any[]) => boolean
    private gameEngine: GameEngine
    private io: Server
    private characterDB: JsonDB
    private objectDB: JsonDB
    private playerDB: JsonDB

    constructor(io: Server) {
        this.io = io
        const eventEmitter: EventEmitter = new EventEmitter()
        this.gameEngine = new GameEngine({ ticksPerSecond: 30 }, eventEmitter)
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)

        this.characterDB = new JsonDB(new Config(CHARACTER_DB_PATH, true, true, '/'))
        this.objectDB = new JsonDB(new Config(OBJECT_DB_PATH, true, true, '/'))
        this.playerDB = new JsonDB(new Config(PLAYER_DB_PATH, true, true, '/'))
        this.loadWorld()

        //start the gameengines clock thingy
        this.gameEngine.start()

        //updated characters from the gameengine running on the server
        this.on(CONSTANTS.SERVER_CHARACTER_UPDATE, (characters: string[]) => {
            //console.log('serverengine SERVER_CHARACTER_UPDATE')
            this.sendAndSaveCharacterUpdates(characters)
        })

        this.on(CONSTANTS.GAME_EVENTS, (events: GameEvent[]) => {
            //console.log('serverengine GAME_EVENTS')
            this.sendEvents(events)
        })

        io.on(CONSTANTS.CONNECTION, async socket => {
            //console.log(CONNECTION, socket.id) 
            let player: Player | undefined
            //let session: Session | null
            getSession({ req: socket.conn.request, }).then(async (session) => {
                if (session?.user?.email) {
                    player = await this.getPlayerByEmail(session?.user?.email)
                    if (!player) {
                        player = await this.savePlayer({ email: session.user.email, id: uuidv4() })
                    }
                    console.log(player.email, 'joined')
                    socket.join(player.id)

                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                }
            })

            //CONSTANTS.CHAT
            socket.on(CONSTANTS.CHAT, async (event: GameEvent) => {
                //console.log('CONSTANTS.CHAT', event)
                //just send it back to everyone
                //TODO only send it to clients in range
                socket.broadcast.emit(CONSTANTS.CHAT, event)
            })


            //tell the client where all the character are
            //client is 
            socket.on(CONSTANTS.CLIENT_VIEWPORT, (viewPort: ViewPort) => {
                //console.log('CLIENT_VIEWPORT')
                //console.log('viewport', (viewPort.right - viewPort.left) * (viewPort.bottom - viewPort.top))
                const started = (new Date()).getTime()
                //join the right zones/rooms
                let oldZones = socket.rooms
                let newZones = this.gameEngine.getZonesIn(viewPort)
                //TODO switch to bigger zones if we're zoomed out a bunch
                //console.log(newZones)
                //get the list of oldZones that aren't in newZones
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
                const characters = this.gameEngine.gameWorld.getCharactersInZones(brandNewZones)
                //console.log('socket.rooms', socket.rooms.size)
                //only send characters the client didn't already have in its old viewport
                if (characters.length > 0) {
                    socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, characters)
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
                    let character
                    [player, character] = await this.controlCharacter(characterId, player?.email)
                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                    //TODO send character update
                }
                else {
                    console.log('bailing on control character, no session')
                }
            })

            socket.on(CONSTANTS.CREATE_CHARACTER, () => {
                const character = this.createCharacter({ characterClass: "FIGHTER", level: 6 })
                this.sendAndSaveCharacterUpdates([character])
            })

            socket.on(CONSTANTS.CREATE_OBJECT, () => {
                const object = this.createObject()
                //this.sendObjects()
            })

            socket.on(CONSTANTS.ATTACK, async (attacker: string, attackee: string) => {
                if (attackee) {
                    this.attack(attacker, attackee)
                }
                else {
                    this.attackStop(attacker)
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
                this.move(characterId, location)
            })

            socket.on(CONSTANTS.CAST_SPELL, async ({ casterId: casterId, spellName: spellName, targets: targets }) => {
                //console.log('spellName',spellName)
                //console.log('casterId',casterId)
                //console.log('targets',targets)
                const updatedCharacters = this.gameEngine.castSpell(casterId, spellName, targets)
                //console.log(updatedCharacters)
                io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, updatedCharacters)
            })

            socket.on(CONSTANTS.CREATE_COMMUNITY, async (options: { size: string, race: string, location: Point }) => {
                //console.log('options', options)
                //console.log('location', location)
                //console.log('targets',targets) 
                this.createCommunity(options)
            })

            socket.on(CONSTANTS.CLAIM_CHARACTER, async (characterId: string) => {
                if (!!player) {
                    let character
                    [player, character] = await this.claimCharacter(characterId, player.email)
                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                    //TODO send character update
                }
                else {
                    console.log('bailing on claim character, no session')
                }
            })

            socket.on(CONSTANTS.UNCLAIM_CHARACTER, async (characterId: string) => {
                if (!!player) {
                    let character
                    [player, character] = await this.unClaimCharacter(characterId, player.email)
                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)
                    //TODO send character update
                }
                else {
                    console.log('bailing on unclaim character, no session')
                }
            })

            socket.on(CONSTANTS.DISCONNECT, (reason: string) => {
                console.log('CONSTANTS.DISCONNECT', reason)
                //remove the character from the database
                //db.delete('/pc/' + socket.id)
                //broadcast the removal
                //socket.broadcast.emit(PC_DISCONNECT, socket.id)
            })
        })
    }
    createObject() {
        const id = uuidv4()
        const o = new WorldObject({ id })
        this.saveObject(o)
    }

    async saveObject(newObject: WorldObject) {
        //look up the player first and then merge
        let old
        try {
            old = await this.objectDB.getObject<WorldObject>(CONSTANTS.OBJECT_PATH + newObject.id)
        }
        catch (error) {
            console.log('error looking up old object', newObject)
        }
        const merged = { ...new WorldObject({}), ...old, ...newObject }
        //console.log('merged', merged)
        await this.objectDB.push(CONSTANTS.OBJECT_PATH + merged.id, merged)
        return merged
    }

    move(characterId: string, location: Point) {
        this.gameEngine.moveCharacter(characterId, location)
        this.sendAndSaveCharacterUpdates([characterId])
    }

    attackStop(attackerId: string) {
        this.gameEngine.attackStop(attackerId)
    }

    sendEvents(events: GameEvent[]) {
        //console.log('sendEvents')
        this.io.emit(CONSTANTS.GAME_EVENTS, events)
    }

    async savePlayer(player: Partial<Player>): Promise<Player> {
        //look up the player first and then merge
        let old
        try {
            old = await this.playerDB.getObject<Player>(CONSTANTS.PLAYER_PATH + player.email)
        }
        catch (error) {
            console.log('error saving player', player)
        }
        const merged = { ...new Player({}), ...old, ...player }
        //console.log('merged', merged)
        this.playerDB.push('/PLAYER/' + player.email, merged)
        return merged
    }

    async getPlayerByEmail(email: string): Promise<Player | undefined> {
        //console.log('getPlayerByEmail')
        let player: Player
        try {
            player = await this.playerDB.getObject<Player>(CONSTANTS.PLAYER_PATH + email)
            return player
        } catch (error) {
        }
        return undefined
    }

    attack(attacker: string, attackee: string) {
        //console.log('serverengine.attack')
        this.gameEngine.attack(attacker, attackee)
        this.sendAndSaveCharacterUpdates([attacker, attackee])
    }

    getCharacter(id: string) {
        return this.gameEngine.getCharacter(id)
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
            email: player.email, claimedCharacters: player.claimedCharacters,
            //if we're unclaimed the controlled character, uncontrol it, otherwise leave the current controlled character
            controlledCharacter: player.controlledCharacter == characterId ? "" : player.controlledCharacter
        })

        //tell the client it worked
        this.io.to(player.id).emit(CONSTANTS.CURRENT_PLAYER, player)
        if (character) {
            this.sendAndSaveCharacterUpdates([character.id])
        }
        return [player, character]
    }

    async claimCharacter(characterId: string, playerEmail: string): Promise<[Player | undefined, Character | undefined]> {
        if (!playerEmail) {
            console.log('bailing on claim character: no email')
            return [undefined, undefined]
        }
        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //console.log(player)
        if (!player) {
            //console.log('make a new player')
            const id = uuidv4()
            player = await this.savePlayer({ email: playerEmail, id: id })
            //console.log(player)
        }
        //we've got a player now
        const character = this.getCharacter(characterId)
        //if we already claimed this character, then bail
        if (player.claimedCharacters.some((c) => c == characterId)) {
            console.log('bailing on claim character, already claimed this character')
            return [player, character]
        }


        if (!character) {
            console.log('bailing on claim character: no character')
            return [player, character]
        }

        //check if the character is claimed by another player
        if (!!character.playerId) {
            console.log('character.playerId', character.playerId)
            console.log('bailing on claim character: claimed by another player')
            return [player, character]
        }

        this.gameEngine.updateCharacter({ id: characterId, playerId: player.id })

        player.claimedCharacters.push(characterId)
        player = await this.savePlayer({ email: player.email, claimedCharacters: player.claimedCharacters })

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
            //console.log(player)
        }

        let character = this.getCharacter(characterId)
        if ((!!characterId && !character)) {
            return [player, character]
        }

        //claim it if possible
        if (characterId) {
            [player, character] = await this.claimCharacter(characterId, playerEmail)
        }

        player = await this.savePlayer({ ...player, controlledCharacter: characterId })

        return [player, character]

    }

    private loadWorld() {
        console.log('loading world')
        try {
            this.characterDB.load()
                .then(() => {
                    this.characterDB.getObject<{}>(CONSTANTS.CHARACTER_PATH).then((c: {}) => {
                        const characters: Character[] = []
                        Object.entries(c).map(([id, character]: [id: string, character: any]) => {
                            characters.push(character)
                        })
                        this.gameEngine.updateCharacters(characters)
                    }).catch(err => {
                        console.log('empty player database', err)
                    })
                }).catch((error) => {
                    console.log('failed to load db ', error)
                })
        }
        catch (e) {
            //console.log('failed to load')
        }
        try {
            this.objectDB.load()
                .then(() => {
                    this.characterDB.getObject<{}>(CONSTANTS.OBJECT_PATH).then((c: {}) => {
                        const objects: WorldObject[] = []
                        Object.entries(c).map(([id, object]: [id: string, object: any]) => {
                            objects.push(object)
                        })
                        this.gameEngine.updateObject(objects)
                    }).catch(err => {
                        console.log('empty player database', err)
                    })
                }).catch((error) => {
                    console.log('failed to load db ', error)
                })
        }
        catch (e) {
            //console.log('failed to load')
        }
        console.log('finished loading world')
    }

    private sendAndSaveCharacterUpdates(characterIds: string[]) {
        //only send character updates to the room/zone they're in
        const a: Zones2 = this.gameEngine.gameWorld.getCharactersIntoZones(characterIds)
        //console.log(a)

        a.forEach((characters, zoneName) => {
            characters.forEach((character, characerId) => {
                //persist the character
                if (!!character) {
                    //character still exists
                    try {
                        //TODO maybe don't persist so frequently?
                        this.characterDB.push(CONSTANTS.CHARACTER_PATH + characerId, character)
                    }
                    catch (e) {
                        console.log('failed to save character', character)
                    }
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

    createCommunity({ size, race, location }: { size: string, race: string, location: Point }) {
        const started = (new Date()).getTime()
        const logging = false
        console.log('createCommunity')
        console.log(size)
        let modifier = -16
        let totalSize = 0
        let createdCount = 0
        let radius = 90

        switch (size) {
            case "THORP":
                modifier = -3
                totalSize = roll({ size: 60, modifier: 20 })
                break
            case "HAMLET":
                modifier = -2
                totalSize = roll({ size: 320, modifier: 80 })
                radius = 240
                break
            case "VILLAGE":
                modifier = -1
                totalSize = roll({ size: 500, modifier: 400 })
                radius = 500
                break
            case "SMALL_TOWN":
                modifier = 0
                totalSize = roll({ size: 1100, modifier: 900 })
                radius = 800
                break
            case "LARGE_TOWN":
                modifier = 3
                totalSize = roll({ size: 3000, modifier: 2000 })
                radius = 1200
                break
            case "SMALL_CITY":
                modifier = 6
                totalSize = roll({ size: 7000, modifier: 5000 })
                radius = 1500
                break
            case "LARGE_CITY":
                modifier = 9
                totalSize = roll({ size: 13000, modifier: 12000 })
                radius = 2000
                break
            case "METROPOLIS":
                modifier = 12
                totalSize = roll({ size: 75000, modifier: 25000 })
                radius = 3200
                break
        }

        if (logging) console.log('modifier', modifier)

        //pc classes
        //barbarians
        let characters = this.populateClass({
            className: 'BARBARIAN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        if (logging) console.log(characters.length, 'BARBARIAN')

        //bards
        characters = characters.concat(this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'BARD')

        //clerics 
        characters = characters.concat(this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'BARD')

        //druid
        characters = characters.concat(this.populateClass({
            className: 'DRUID',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'DRUID')

        //fighter 
        characters = characters.concat(this.populateClass({
            className: 'FIGHTER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'FIGHTER')

        //monk 
        characters = characters.concat(this.populateClass({
            className: 'MONK',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'MONK')

        //paladin 
        characters = characters.concat(this.populateClass({
            className: 'PALADIN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'PALADIN')

        //ranger 
        characters = characters.concat(this.populateClass({
            className: 'RANGER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'RANGER')

        //rogue 
        characters = characters.concat(this.populateClass({
            className: 'ROGUE',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'ROGUE')

        //sorcerer 
        characters = characters.concat(this.populateClass({
            className: 'SORCERER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'SORCERER')

        //wizard 
        characters = characters.concat(this.populateClass({
            className: 'WIZARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'WIZARD')

        //npc classes
        //adepts  
        characters = characters.concat(this.populateClass({
            className: 'ADEPT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'ADEPT')

        //aristocrats
        characters = characters.concat(this.populateClass({
            className: 'ARISTOCRAT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'ARISTOCRAT')

        //commoner 
        characters = characters.concat(this.populateClass({
            className: 'COMMONER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'COMMONER')

        //expert 
        characters = characters.concat(this.populateClass({
            className: 'EXPERT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        }))
        if (logging) console.log(characters.length, 'EXPERT')

        //warrior
        characters = characters.concat(this.populateClass({
            className: 'WARRIOR',
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
            while (this.gameEngine.gameWorld.getCharactersNearby({ location: p, r: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "ARISTOCRAT", location: p })
            createdCount++
            characters.push(c)
        }
        if (logging) console.log(characters.length, 'ARISTOCRAT')

        //create .5% adepts
        for (let i = 0; i < remaining * .005; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearby({ location: p, r: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c: string = this.createCharacter({ characterClass: "ADEPT", location: p })
            createdCount++
            characters.push(c)
        }
        if (logging) console.log(characters.length, 'ADEPT')

        //create 3% experts
        for (let i = 0; i < remaining * .03; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearby({ location: p, r: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "EXPERT", location: p })
            createdCount++
            characters.push(c)
        }
        if (logging) console.log(characters.length, 'EXPERT')

        //create 5% warriors
        for (let i = 0; i < remaining * .05; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearby({ location: p, r: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "WARRIOR", location: p })
            createdCount++
            characters.push(c)
        }
        if (logging) console.log(characters.length, 'WARRIOR')

        //console.log('createdCount before commoner fill', createdCount)

        //create the rest as commoners
        for (let i = 0; createdCount < totalSize; i++) {
            let p = getRandomPoint({ origin: location, radius })
            while (this.gameEngine.gameWorld.getCharactersNearby({ location: p, r: buffer }).length > 0) {
                radius += 1
                p = getRandomPoint({ origin: location, radius })
            }
            const c = this.createCharacter({ characterClass: "COMMONER", location: p })
            createdCount++
            characters.push(c)
        }
        //console.log('createdCount after commoner fill', createdCount)
        if (logging) console.log(characters.length, 'COMMONER')
        this.sendAndSaveCharacterUpdates(characters)

        const finished = (new Date()).getTime()
        if (finished - started > 5) {
            console.log('step duration', finished - started)
        }
    }

    private populateClass({ className, diceCount, diceSize, modifier, origin, radius }: ClassPopulation): string[] {
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
                while (this.gameEngine.gameWorld.getCharactersNearby({ location, r: buffer }).length > 0) {
                    radius += 1;
                    location = getRandomPoint({ origin, radius })
                }

                const level = Math.round(l)
                const xp = LEVELS[level.toString() as keyof typeof LEVELS]
                const id = this.createCharacter({ characterClass: className, level: level, xp: xp, location: location })
                //console.log('c', c)
                createdCharacterIds = [...createdCharacterIds, id]
                ///updatedZones = new Map([...updatedZones, ...zones])
            }
        }
        //console.log(updatedCharacters)
        return createdCharacterIds
    }

    //we have class and level
    private createCharacter(character: Partial<Character>): string {
        const classInfo = CLASSES[character.characterClass as keyof typeof CLASSES]
        const hitDie = classInfo.HitDie
        const bab = classInfo.BAB[character.level?.toString() as keyof typeof classInfo.BAB]
        const hp = roll({ size: hitDie, count: character.level! - 1, modifier: hitDie })
        let x = roll({ size: 60, modifier: -30 })
        let y = roll({ size: 60, modifier: -30 })
        const id = uuidv4()
        const age = 30
        this.gameEngine.createCharacter({ id: id, location: { x: x, y: y }, hp: hp, maxHp: hp, bab: bab, age: age, ...character })
        return id
    }
}