import EventEmitter from "events"
import GameEngine from "@/GameEngine"
import * as CONSTANTS from "@/CONSTANTS"
import Character from "@/Character"
import { Config, JsonDB } from "node-json-db"
import { Server } from "socket.io"
import { Zone, Zones } from "./GameWorld"
import { getSession } from "next-auth/react"
import { Session } from "next-auth"
import Player from "./Player"
import { v4 as uuidv4 } from 'uuid';

export default class ServerEngine {
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    emit: (eventName: string | symbol, ...args: any[]) => boolean
    gameEngine: GameEngine
    io: Server
    worldDB: JsonDB
    playerDB: JsonDB

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

            socket.on(CONSTANTS.CREATE_CHARACTER, () => {
                this.createCharacter()
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
                // console.log('options', options)
                //  console.log('location', location)
                //  console.log('targets',targets)
                const [updatedCharacters, updatedZones] = this.gameEngine.createCommunity(options)
                //  console.log(updatedCharacters)
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

    private createCharacter() {
        //  console.log('ServerEngine createCharacter')
        let x = this.gameEngine.roll({ size: 30, modifier: -15 })
        let y = this.gameEngine.roll({ size: 30, modifier: -15 })
        const id = uuidv4();
        const [c, zones] = this.gameEngine.createCharacter({ id: id, x: x, y: y })
        this.sendAndSaveCharacterUpdates(c, zones)
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
}