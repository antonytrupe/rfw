import EventEmitter from "events"
import GameEngine from "@/GameEngine"
import { ClassPopulation } from "./ClassPopulation"
import * as CONSTANTS from "@/CONSTANTS"
import Character from "@/Character"
import { Config, JsonDB } from "node-json-db"
import { Server } from "socket.io"
import { Zones } from "./Zones"
import { getSession } from "next-auth/react"
import Player from "./Player"
import { v4 as uuidv4 } from 'uuid';
import { getRandomPoint, roll } from "./utility"
import { GameEvent } from "./GameEvent"
import * as CLASSES from "./CLASSES.json"
import * as LEVELS from "./LEVELS.json"

export default class ServerEngine {
    private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    private emit: (eventName: string | symbol, ...args: any[]) => boolean
    private gameEngine: GameEngine
    private io: Server
    private worldDB: JsonDB
    private playerDB: JsonDB

    constructor(io: Server) {
        this.io = io
        const eventEmitter: EventEmitter = new EventEmitter()
        this.gameEngine = new GameEngine({ ticksPerSecond: 30 }, eventEmitter)
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)

        this.worldDB = new JsonDB(new Config("world", true, true, '/'))
        this.playerDB = new JsonDB(new Config("player", true, true, '/'))
        this.loadWorld()
        //this.loadPlayers()

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
                //session = s

                if (session?.user?.email) {
                    player = await this.getPlayerByEmail(session?.user?.email)
                    if (!player) {
                        player = await this.savePlayer({ email: session.user.email, id: uuidv4() })
                    }
                    socket.join(player.id)

                    socket.emit(CONSTANTS.CURRENT_PLAYER, player)

                    socket.emit(CONSTANTS.CLAIMED_CHARACTERS,
                        this.gameEngine.gameWorld.getCharacters(player?.claimedCharacters)
                    )

                    socket.emit(CONSTANTS.CONTROL_CHARACTER,
                        this.gameEngine.gameWorld.getCharacter(player?.controlledCharacter)
                    )
                }
            })

            //CONSTANTS.CLIENT_INITIAL
            socket.on(CONSTANTS.CLIENT_INITIAL, async (viewPort: CONSTANTS.CLIENT_INITIAL_INTERFACE) => {
                //TODO join the right zone channels given the viewPort
                socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE,
                    this.gameEngine.gameWorld.getCharactersWithin(viewPort)
                )
            })

            //CONSTANTS.CONTROL_CHARACTER
            //don't think the server cares
            socket.on(CONSTANTS.CONTROL_CHARACTER, (characterId: string | undefined) => {
                //console.log('serverengine controlcharacter', characterId)
                if (!!player && characterId) {
                    this.controlCharacter(characterId, player?.email)
                }
                else {
                    console.log('no session')
                }
            })

            socket.on(CONSTANTS.CREATE_CHARACTER, () => {
                const characters = this.createCharacter({ characterClass: "FIGHTER", level: 6 })
                this.sendAndSaveCharacterUpdates([characters], new Map())
            })

            socket.on(CONSTANTS.ATTACK, async (attacker: string, attackee: string) => {
                if (attackee) {
                    this.attack(attacker, attackee)
                }
                else {
                    this.attackStop(attacker)
                }
            })

            socket.on(CONSTANTS.TURN_LEFT, async (character: Character) => {
                this.turnLeft(character, player)
            })

            socket.on(CONSTANTS.TURN_RIGHT, async (character: Character) => {
                this.turnRight(character, player)
            })

            socket.on(CONSTANTS.TURN_STOP, async (character: Character) => {
                this.turnStop(character, player)
            })

            socket.on(CONSTANTS.STOP_ACCELERATE, async (character: Character) => {
                this.accelerateStop(character, player)
            })

            socket.on(CONSTANTS.ACCELERATE, async (character: Character) => {
                this.accelerate(character, player)
            })

            socket.on(CONSTANTS.DECELERATE, async (character: Character) => {
                this.decelerate(character, player)
            })

            socket.on(CONSTANTS.ACCELERATE_DOUBLE, async (character: Character) => {
                this.accelerateDouble(character, player)
            })

            socket.on(CONSTANTS.STOP_DOUBLE_ACCELERATE, async (character: Character) => {
                this.accelerateDoubleStop(character, player)
            })

            socket.on(CONSTANTS.CAST_SPELL, async ({ casterId: casterId, spellName: spellName, targets: targets }) => {
                //console.log('spellName',spellName)
                //console.log('casterId',casterId)
                //console.log('targets',targets)
                const updatedCharacters = this.gameEngine.castSpell(casterId, spellName, targets)
                //console.log(updatedCharacters)
                io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, updatedCharacters)
            })

            socket.on(CONSTANTS.CREATE_COMMUNITY, async (options: { size: string, race: string, location: { x: number, y: number } }) => {
                //console.log('options', options)
                //console.log('location', location)
                //console.log('targets',targets) 
                this.createCommunity(options)
            })

            //CONSTANTS.CLAIM_CHARACTER
            socket.on(CONSTANTS.CLAIM_CHARACTER, async (characterId: string) => {
                if (!!player) {
                    this.claimCharacter(characterId, player.email)
                }
                else {
                    console.log('no session')
                }
            })

            //CONSTANTS.CLAIM_CHARACTER
            socket.on(CONSTANTS.UNCLAIM_CHARACTER, async (characterId: string) => {
                if (!!player) {
                    this.unClaimCharacter(characterId, player.email)
                }
                else {
                    console.log('no session')
                }
            })

            socket.on(CONSTANTS.DISCONNECT, (reason: string) => {
                console.log('CONSTANTS.DISCONNECT', reason)
                //remove the character from the database
                //db.delete('/pc/' + socket.id)
                //broadcast the removal
                //socket.broadcast.emit(PC_DISCONNECT, socket.id)
            })

            //tell the client where all the character are
            socket.on(CONSTANTS.CLIENT_CHARACTER_UPDATE, (viewPort: { top: number, bottom: number, left: number, right: number }) => {
                //join the right zones/rooms
                let oldZones = socket.rooms
                let newZones = this.gameEngine.getZonesIn(viewPort)
                //console.log(newZones)
                //get the list of oldZones that aren't in newZones
                //leave zones we shouldn't be in
                oldZones.forEach((zone) => {
                    if (!newZones.includes(zone)) {
                        socket.leave(zone)
                    }
                })
                //get the list of newZones that aren't in oldZones
                newZones.forEach((zone) => {
                    if (!Array.from(oldZones).includes(zone)) {
                        socket.join(zone)
                    }
                })
                socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, this.gameEngine.gameWorld.getCharactersWithin(viewPort))
            })
        })
    }

    attackStop(attackerId: string) {
        this.gameEngine.attackStop(attackerId)
    }

    async unClaimCharacter(characterId: string, playerEmail: string) {
        if (!playerEmail) {
            console.log('bailing on unclaim character: no email')
            return
        }

        const character = this.gameEngine.gameWorld.getCharacter(characterId)
        if (!character) {
            console.log('bailing on unclaim character: no character')
            return
        }

        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //bail if no player found
        if (!player) {
            return
        }

        //we've got a player now
        const c = this.gameEngine.unClaimCharacter(characterId)
        //console.log('claimed character', c)
        if (c) {
            player.claimedCharacters.splice(player.claimedCharacters.indexOf(c.id), 1)
            this.savePlayer({
                email: player.email, claimedCharacters: player.claimedCharacters,
                //if we're unclaimed the controlled character, uncontrol it, otherwise leave the current controlled character
                controlledCharacter: player.controlledCharacter == characterId ? "" : player.controlledCharacter
            })

            //tell the client it worked
            this.io.to(player.id).emit(CONSTANTS.CLAIMED_CHARACTERS,
                this.gameEngine.gameWorld.getCharacters(player.claimedCharacters)
            )
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    sendEvents(events: GameEvent[]) {
        //console.log('sendEvents')
        this.io.emit(CONSTANTS.GAME_EVENTS, events)
    }

    async savePlayer(player: Partial<Player>): Promise<Player> {
        //TODO look up the player first and then merge
        let old
        try {
            old = await this.playerDB.getObject<Player>('/PLAYER/' + player.email)
        }
        catch (error) {

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
            player = await this.playerDB.getObject<Player>('/PLAYER/' + email)
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

    accelerateDoubleStop(character: Character, player: Player | undefined) {
        const c = this.gameEngine.accelerateDoubleStop(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    accelerateDouble(character: Character, player: Player | undefined) {
        const c = this.gameEngine.accelerateDouble(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    decelerate(character: Character, player: Player | undefined) {
        const c = this.gameEngine.decelerate(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    accelerate(character: Character, player: Player | undefined) {
        const c = this.gameEngine.accelerate(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    accelerateStop(character: Character, player: Player | undefined) {
        const c = this.gameEngine.accelerateStop(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    turnStop(character: Character, player: Player | undefined) {
        const c = this.gameEngine.turnStop(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    turnRight(character: Character, player: Player | undefined) {
        const c = this.gameEngine.turnRight(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    turnLeft(character: Character, player: Player | undefined) {
        const c = this.gameEngine.turnLeft(character, player?.id)
        if (c) {
            this.sendAndSaveCharacterUpdates([c.id], undefined)
        }
    }

    async claimCharacter(characterId: string, playerEmail: string) {
        if (!playerEmail) {
            console.log('bailing on claim character: no email')
            return
        }
        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //console.log(player)
        if (!player) {
            //console.log('make a new player')
            const id = uuidv4();
            player = await this.savePlayer({ email: playerEmail, id: id })
            //console.log(player)
        }
        //we've got a player now

        //if we already claimed this character, then bail
        if (player.claimedCharacters.some((c) => c == characterId)) {
            console.log('bailing on claim character, already claimed this character')
            return
        }

        const character = this.getCharacter(characterId)
        if (!character) {
            console.log('bailing on claim character: no character')
            return
        }

        //check if the character is claimed by another player
        if (!!character.playerId) {
            console.log('character.playerId', character.playerId)
            console.log('bailing on claim character: claimed by another player')
            return
        }

        this.gameEngine.updateCharacter({ id: characterId, playerId: player.id })

        player.claimedCharacters.push(characterId)
        this.savePlayer({ email: player.email, claimedCharacters: player.claimedCharacters })

        //tell the client it worked
        this.io.to(player.id).emit(CONSTANTS.CLAIMED_CHARACTERS,
            this.gameEngine.gameWorld.getCharacters(player?.claimedCharacters)
        )

        this.sendAndSaveCharacterUpdates([characterId], undefined)
        return this
    }

    async controlCharacter(characterId: string, playerEmail: string) {
        //console.log('controlCharacter')
        const character = this.getCharacter(characterId)
        if ((!!characterId && !character) || !playerEmail) {
            return
        }

        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //console.log(player)
        if (!player) {
            //console.log('make a new player')
            const id = uuidv4();
            player = await this.savePlayer({ email: playerEmail, id: id })
            //console.log(player)
        }

        //claim it if possible
        if (characterId) {
            this.claimCharacter(characterId, playerEmail)
        }

        this.savePlayer({ ...player, controlledCharacter: characterId })

    }

    private loadWorld() {
        try {
            this.worldDB.load().then(() => {
                this.worldDB.getObject<{}>(CONSTANTS.CHARACTER_PATH).then((c: {}) => {
                    //console.log(c)
                    //[index: string]: string
                    const characters: Character[] = []

                    //@ts-check
                    Object.entries(c).map(([id, character]: [id: string, character: any]) => {
                        characters.push(character)

                    })
                    this.gameEngine.gameWorld.updateCharacters(characters)
                }).catch(err => {
                    //console.log('empty database')
                })
            })
        }
        catch (e) {
            //console.log('failed to load')
        }
    }

    private sendAndSaveCharacterUpdates(characterIds: string[], zones: Zones | undefined = undefined) {
        //TODO only send character updates to the room/zone they're in
        characterIds.forEach((id) => {
            const character = this.getCharacter(id)
            this.io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, [character])

            try {
                //array version
                this.worldDB.push(CONSTANTS.CHARACTER_PATH + id, character)
            }
            catch (e) {
                console.log('failed to save character', character)
            }
        })
    }

    createCommunity({ size, race, location }: { size: string, race: string, location: { x: number, y: number } }) {
        //console.log('createCommunity')
        //console.log(size)
        //let updatedZones: Zones = new Map<string, Set<string>>()
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
                radius = 200
                break
            case "VILLAGE":
                modifier = -1
                totalSize = roll({ size: 500, modifier: 400 })
                radius = 300
                break
            case "SMALL_TOWN":
                modifier = 0
                totalSize = roll({ size: 1100, modifier: 900 })
                radius = 500
                break
            case "LARGE_TOWN":
                modifier = 3
                totalSize = roll({ size: 3000, modifier: 2000 })
                radius = 800
                break
            case "SMALL_CITY":
                modifier = 6
                totalSize = roll({ size: 7000, modifier: 5000 })
                radius = 1100
                break
            case "LARGE_CITY":
                modifier = 9
                totalSize = roll({ size: 13000, modifier: 12000 })
                radius = 1600
                break
            case "METROPOLIS":
                modifier = 12
                totalSize = roll({ size: 75000, modifier: 25000 })
                radius = 3200
                break
        }

        //console.log(modifier)

        //pc classes
        //barbarians

        let [characters, zones] = this.populateClass({
            className: 'BARBARIAN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        console.log(characters)
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //bards
        [characters, zones] = this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //clerics 
        [characters, zones] = this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //druid
        [characters, zones] = this.populateClass({
            className: 'DRUID',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //fighter 
        [characters, zones] = this.populateClass({
            className: 'FIGHTER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //monk 
        [characters, zones] = this.populateClass({
            className: 'MONK',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //paladin 
        [characters, zones] = this.populateClass({
            className: 'PALADIN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //ranger 
        [characters, zones] = this.populateClass({
            className: 'RANGER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //rogue 
        [characters, zones] = this.populateClass({
            className: 'ROGUE',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //sorcerer 
        [characters, zones] = this.populateClass({
            className: 'SORCERER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //warrior 
        [characters, zones] = this.populateClass({
            className: 'WARRIOR',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //wizard 
        [characters, zones] = this.populateClass({
            className: 'WIZARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //npc classes
        //adepts  
        [characters, zones] = this.populateClass({
            className: 'ADEPT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //aristocrats 
        [characters, zones] = this.populateClass({
            className: 'ARISTOCRAT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //commoner 
        [characters, zones] = this.populateClass({
            className: 'COMMONER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //expert 
        [characters, zones] = this.populateClass({
            className: 'EXPERT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        });
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        //warrior
        [characters, zones] = this.populateClass({
            className: 'WARRIOR',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        });
        createdCount += characters.length
        this.sendAndSaveCharacterUpdates(characters);

        let remaining = totalSize - createdCount
        //make more level 1 characters
        //create .5% aristocrats
        for (let i = 0; i < remaining * .005; i++) {
            let p
            do {
                p = getRandomPoint({ origin: location, radius })
            } while (this.gameEngine.gameWorld.getCharactersNearby({ x: p.x, y: p.y, r: 5 }).length > 0)

            const c = this.createCharacter({ characterClass: "ARISTOCRAT", x: p.x, y: p.y });
            createdCount++
            this.sendAndSaveCharacterUpdates([c])
        }

        //create .5% adepts
        for (let i = 0; i < remaining * .005; i++) {
            let p
            do {
                p = getRandomPoint({ origin: location, radius })
            } while (this.gameEngine.gameWorld.getCharactersNearby({ x: p.x, y: p.y, r: 5 }).length > 0) const c: string = this.createCharacter({ characterClass: "ADEPT", x: p.x, y: p.y });
            createdCount++
            this.sendAndSaveCharacterUpdates([c])
        }
        //create 3% experts
        for (let i = 0; i < remaining * .03; i++) {
            let p
            do {
                p = getRandomPoint({ origin: location, radius })
            } while (this.gameEngine.gameWorld.getCharactersNearby({ x: p.x, y: p.y, r: 5 }).length > 0) const c = this.createCharacter({ characterClass: "EXPERT", x: p.x, y: p.y });
            createdCount++
            this.sendAndSaveCharacterUpdates([c])
        }
        //create 5% warriors
        for (let i = 0; i < remaining * .05; i++) {
            let p
            do {
                p = getRandomPoint({ origin: location, radius })
            } while (this.gameEngine.gameWorld.getCharactersNearby({ x: p.x, y: p.y, r: 5 }).length > 0) const c = this.createCharacter({ characterClass: "WARRIOR", x: p.x, y: p.y });
            createdCount++
            this.sendAndSaveCharacterUpdates([c])
        }

        //create the rest as commoners
        for (let i = 0; createdCount < totalSize; i++) {
            let p
            do {
                p = getRandomPoint({ origin: location, radius })
            } while (this.gameEngine.gameWorld.getCharactersNearby({ x: p.x, y: p.y, r: 5 }).length > 0) const c = this.createCharacter({ characterClass: "COMMONER", x: p.x, y: p.y });
            createdCount++
            this.sendAndSaveCharacterUpdates([c])
        }
    }

    private populateClass({ className, diceCount, diceSize, modifier, origin, radius }: ClassPopulation): [string[], Zones] {

        let createdCharacterIds: string[] = []
        //let updatedZones = new Map<string, Set<string>>()
        const highestLevel = roll({ size: diceSize, count: diceCount, modifier: modifier })
        //console.log(className, highestLevel)
        //work our way down from highest level
        for (let l = highestLevel; l >= 1; l /= 2) {
            //console.log('level', level);
            //make the right amount of each level
            for (let i = 0; i < highestLevel / l; i++) {
                let x, y
                do {
                    ({ x, y } = getRandomPoint({ origin, radius }))
                } while (this.gameEngine.gameWorld.getCharactersNearby({ x: x, y: y, r: 5 }).length > 0)

                const level = Math.round(l)
                const xp = LEVELS[level.toString() as keyof typeof LEVELS]
                const id = this.createCharacter({ characterClass: className, level: level, xp: xp, x: x, y: y })
                //console.log('c', c)
                createdCharacterIds = [...createdCharacterIds, id]
                ///updatedZones = new Map([...updatedZones, ...zones])
            }
        }
        //console.log(updatedCharacters)
        return [createdCharacterIds, new Map()]
    }

    //we have class and level
    private createCharacter(character: Partial<Character>): string {
        const classInfo = CLASSES[character.characterClass as keyof typeof CLASSES]
        const hitDie = classInfo.HitDie
        const bab = classInfo.BAB[character.level?.toString() as keyof typeof classInfo.BAB]
        const hp = roll({ size: hitDie, count: character.level! - 1, modifier: hitDie })
        let x = roll({ size: 60, modifier: -30 })
        let y = roll({ size: 60, modifier: -30 })
        const id = uuidv4();
        const age = 30
        this.gameEngine.createCharacter({ id: id, x: x, y: y, hp: hp, maxHp: hp, bab: bab, age: age, ...character })
        return id
    }
}