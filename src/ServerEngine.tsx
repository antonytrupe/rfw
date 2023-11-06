import EventEmitter from "events"
import GameEngine, { ClassPopulation } from "@/GameEngine"
import * as CONSTANTS from "@/CONSTANTS"
import Character from "@/Character"
import { Config, JsonDB } from "node-json-db"
import { Server } from "socket.io"
import { Zone, Zones } from "./GameWorld"
import { getSession } from "next-auth/react"
import { Session } from "next-auth"
import Player from "./Player"
import { v4 as uuidv4 } from 'uuid';
import { getRandomPoint, roll } from "./utility"

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
        // this.loadPlayers()

        //start the gameengines clock thingy
        this.gameEngine.start()

        this.on(CONSTANTS.SERVER_CHARACTER_UPDATE, (characters: Character[], zones: any) => {
            //   console.log('serverengine SERVER_CHARACTER_UPDATE')
            this.sendAndSaveCharacterUpdates(characters, zones)
        })

        io.on(CONSTANTS.CONNECTION, async socket => {
            //console.log(CONNECTION, socket.id) 
            let playerInfo: Player | undefined
            // let session: Session | null
            getSession({ req: socket.conn.request, }).then(async (session) => {
                //  session = s

                if (session?.user?.email) {
                    playerInfo = await this.getPlayerByEmail(session?.user?.email)
                    if (!playerInfo) {
                        playerInfo = await this.savePlayer({ email: session.user.email })

                    }
                    socket.emit(CONSTANTS.SELECTED_CHARACTERS,
                        this.gameEngine.gameWorld.getCharacters(playerInfo?.selectedCharacters)
                    )
                    socket.emit(CONSTANTS.CLAIMED_CHARACTERS,
                        this.gameEngine.gameWorld.getCharacters(playerInfo?.claimedCharacters)
                    )
                }
            })

            //CONSTANTS.CLIENT_INITIAL
            socket.on(CONSTANTS.CLIENT_INITIAL, async (viewPort: CONSTANTS.CLIENT_INITIAL_INTERFACE) => {
                socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE,
                    this.gameEngine.gameWorld.getCharactersWithin(viewPort)
                )
            })

            //CONSTANTS.CONTROL_CHARACTER
            //don't think the server cares
            socket.on(CONSTANTS.CONTROL_CHARACTER, (characterId: string) => {
                if (!!playerInfo) {
                    this.controlCharacter(characterId, playerInfo?.email)
                }
                else {
                    console.log('no session')
                }
            })

            socket.on(CONSTANTS.CREATE_CHARACTER, () => {
                const [characters, zones] = this.createCharacter({})
                this.sendAndSaveCharacterUpdates(characters, zones)
            })

            socket.on(CONSTANTS.TURN_LEFT, async (characters: Character[]) => {
                this.turnLeft(characters)
            })

            socket.on(CONSTANTS.TURN_RIGHT, async (characters: Character[]) => {
                this.turnRight(characters)
            })

            socket.on(CONSTANTS.TURN_STOP, async (characters: Character[]) => {
                this.gameEngine.turnStop(characters)
            })

            socket.on(CONSTANTS.STOP_ACCELERATE, async (characters: Character[]) => {
                this.emit(CONSTANTS.STOP_ACCELERATE, characters)
            })

            socket.on(CONSTANTS.ACCELERATE, async (characters: Character[]) => {
                this.emit(CONSTANTS.ACCELERATE, characters)
            })

            socket.on(CONSTANTS.DECELERATE, async (characters: Character[]) => {
                this.emit(CONSTANTS.DECELERATE, characters)
            })

            socket.on(CONSTANTS.DECELERATE_DOUBLE, async (characters: Character[]) => {
                this.emit(CONSTANTS.DECELERATE_DOUBLE, characters)
            })

            socket.on(CONSTANTS.ACCELERATE_DOUBLE, async (characters: Character[]) => {
                this.emit(CONSTANTS.ACCELERATE_DOUBLE, characters)
            })

            socket.on(CONSTANTS.STOP_DOUBLE_ACCELERATE, async (characters: Character[]) => {
                this.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, characters)
            })

            socket.on(CONSTANTS.CAST_SPELL, async ({ casterId: casterId, spellName: spellName, targets: targets }) => {
                //   console.log('spellName',spellName)
                //  console.log('casterId',casterId)
                //  console.log('targets',targets)
                const updatedCharacters = this.gameEngine.castSpell(casterId, spellName, targets)
                //  console.log(updatedCharacters)
                io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, updatedCharacters)
            })

            socket.on(CONSTANTS.CREATE_COMMUNITY, async (options: { size: string, race: string, location: { x: number, y: number } }) => {
                console.log('options', options)
                //console.log('location', location)
                //  console.log('targets',targets)

                const [updatedCharacters, updatedZones] = this.createCommunity(options)
                console.log(updatedCharacters)
                io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, updatedCharacters)
            })

            //CONSTANTS.CLAIM_CHARACTER
            socket.on(CONSTANTS.CLAIM_CHARACTER, async (characterId: string) => {

                if (!!playerInfo) {
                    this.claimCharacter(characterId, playerInfo.email)
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
                //   join the right zones/rooms
                let oldZones = socket.rooms
                let newZones = this.gameEngine.getZonesIn(viewPort)
                // console.log(newZones)
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

    async savePlayer(player: Partial<Player>): Promise<Player> {
        //TODO look up the player first and then merge
        let old
        try {
            old = await this.playerDB.getObject<Player>('/PLAYER/' + player.email)
        }
        catch (error) { }
        const merged = { ...new Player({}), ...old, ...player }
        this.playerDB.push('/PLAYER/' + player.email, merged)
        return merged
    }

    async getPlayerByEmail(email: string): Promise<Player | undefined> {
        //  console.log('getPlayerByEmail')
        let player: Player
        try {
            player = await this.playerDB.getObject<Player>('/PLAYER/' + email)
            return player
        } catch (error) {
        }
        return undefined
    }

    turnRight(characters: Character[]) {
        const c = this.gameEngine.turnRight(characters)
        if (c.length > 0) {
            this.sendAndSaveCharacterUpdates(c, undefined)
        }
    }

    turnLeft(characters: Character[]) {
        const c = this.gameEngine.turnLeft(characters)
        if (c.length > 0) {
            this.sendAndSaveCharacterUpdates(c, undefined)
        }
    }

    async claimCharacter(characterId: string, playerEmail: string) {

        const character = this.gameEngine.gameWorld.getCharacter(characterId)
        if (!character) {
            return
        }

        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //  console.log(player)
        if (!player) {
            // console.log('make a new player')
            const id = uuidv4();
            player = await this.savePlayer({ email: playerEmail, id: id })
            // console.log(player)
        }

        const [c,] = this.gameEngine.claimCharacter(characterId, player.id)
        // console.log('claimed character', c)
        if (c?.length > 0) {

            player.claimedCharacters.push(c[0].id)
            this.savePlayer(player)

            //tell the client it got worked

            this.sendAndSaveCharacterUpdates(c, undefined)
        }
    }

    async controlCharacter(characterId: string, playerEmail: string) {

        const character = this.gameEngine.gameWorld.getCharacter(characterId)
        if (!character || !playerEmail) {
            return
        }

        //find or create the player
        let player = await this.getPlayerByEmail(playerEmail)
        //  console.log(player)
        if (!player) {
            // console.log('make a new player')
            const id = uuidv4();
            player = await this.savePlayer({ email: playerEmail, id: id })
            // console.log(player)
        }

        //claim it if possible
        this.claimCharacter(characterId, playerEmail)

        this.savePlayer({ ...player, ...{ controlledCharacter: characterId } })

    }

    private createCharacter(character: Partial<Character>): [Character[], Zones] {
        //  console.log('ServerEngine createCharacter')
        let x = roll({ size: 30, modifier: -15 })
        let y = roll({ size: 30, modifier: -15 })
        const id = uuidv4();
        const [c, zones] = this.gameEngine.createCharacter({ id: id, x: x, y: y, ...character })
        //this.sendAndSaveCharacterUpdates(c, zones)
        return [c, zones]
    }

    private loadWorld() {
        try {
            this.worldDB.load().then(() => {
                this.worldDB.getObject<{}>(CONSTANTS.CHARACTER_PATH).then((c: {}) => {
                    //  console.log(c)
                    //  [index: string]: string
                    const characters: Character[] = []

                    // @ts-check
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

    private sendAndSaveCharacterUpdates(characters: Character[], zones: Zones | undefined) {
        //TODO only send character updates to the rooms they're in
        this.io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, characters)

        characters.forEach((character) => {
            try {
                //array version
                this.worldDB.push(CONSTANTS.CHARACTER_PATH + character.id, character)
            }
            catch (e) {
                console.log('failed to save character', character)
            }
        })

    }

    private populateClass({ className, diceCount, diceSize, modifier, origin, radius }: ClassPopulation): [Character[], Zones] {
        let { x, y } = getRandomPoint({ origin, radius })
        let updatedCharacters: Character[] = []
        let updatedZones = new Map<string, Set<string>>()
        const highestLevel = roll({ size: diceSize, count: diceCount, modifier: modifier })
        console.log(className, highestLevel)
        // work our way down from highest level
        for (let level = highestLevel; level >= 1; level /= 2) {
            //console.log('level', level);
            //make the right amount of each level
            for (let i = 0; i < highestLevel / level; i++) {
                const [c, zones] = this.createCharacter({ characterClass: className, level: Math.round(level), x: x, y: y })
                console.log('c', c)
                updatedCharacters = [...updatedCharacters, ...c]
                updatedZones = new Map([...updatedZones, ...zones])
            }
        }
        console.log(updatedCharacters)
        return [updatedCharacters, updatedZones]
    }

    createCommunity({ size, race, location }: { size: string, race: string, location: { x: number, y: number } }): [Character[], Zones] {
        console.log('createCommunity')
        console.log(size)
        let updatedCharacters: Character[] = []
        let updatedZones: Zones = new Map<string, Set<string>>()
        let modifier = -16
        let totalSize = 0

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

        console.log(modifier)

        //pc classes
        //barbarians

        let [characters, zones] = this.populateClass({
            className: 'BARBARIAN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);
        console.log(updatedCharacters);

        //bards
        [characters, zones] = this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //clerics

        [characters, zones] = this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //druid

        [characters, zones] = this.populateClass({
            className: 'DRUID',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //fighter 
        [characters, zones] = this.populateClass({
            className: 'FIGHTER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //monk 
        [characters, zones] = this.populateClass({
            className: 'MONK',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //paladin 
        [characters, zones] = this.populateClass({
            className: 'PALADIN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //ranger 
        [characters, zones] = this.populateClass({
            className: 'RANGER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //rogue 
        [characters, zones] = this.populateClass({
            className: 'ROGUE',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //sorcerer 
        [characters, zones] = this.populateClass({
            className: 'SORCERER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //warrior 
        [characters, zones] = this.populateClass({
            className: 'WARRIOR',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //wizard 
        [characters, zones] = this.populateClass({
            className: 'WIZARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        console.log(updatedCharacters);

        //npc classes
        //adepts  
        [characters, zones] = this.populateClass({
            className: 'ADEPT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //aristocrats 
        [characters, zones] = this.populateClass({
            className: 'ARISTOCRAT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //commoner 
        [characters, zones] = this.populateClass({
            className: 'COMMONER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //expert 
        [characters, zones] = this.populateClass({
            className: 'EXPERT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        });
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //warrior
        [characters, zones] = this.populateClass({
            className: 'WARRIOR',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        });
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        let remaining = totalSize - updatedCharacters.length
        //make more level 1 characters
        //create .5% aristocrats
        for (let i = 0; i < remaining * .005; i++) {
            let p = getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "ARISTOCRAT", x: p.x, y: p.y });
            updatedCharacters = updatedCharacters.concat(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }

        //create .5% adepts
        for (let i = 0; i < remaining * .005; i++) {
            let p = getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "ADEPT", x: p.x, y: p.y });
            updatedCharacters = updatedCharacters.concat(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }
        //create 3% experts
        for (let i = 0; i < remaining * .03; i++) {
            let p = getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "EXPERT", x: p.x, y: p.y });
            updatedCharacters = updatedCharacters.concat(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }
        //create 5% warriors
        for (let i = 0; i < remaining * .05; i++) {
            let p = getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "WARRIOR", x: p.x, y: p.y });
            updatedCharacters = updatedCharacters.concat(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }

        //create the rest as commoners
        for (let i = 0; updatedCharacters.length < totalSize; i++) {
            let p = getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "COMMONER", x: p.x, y: p.y });
            updatedCharacters = updatedCharacters.concat(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }
        console.log(updatedCharacters)

        return [updatedCharacters, updatedZones]
    }
}