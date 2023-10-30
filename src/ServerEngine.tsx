import EventEmitter from "events"
import GameEngine from "@/GameEngine"
import * as CONSTANTS from "@/CONSTANTS";
import Character from "@/Character";
import { Config, JsonDB } from "node-json-db";
import { Server } from "socket.io";
import GameWorld from "./GameWorld";


export default class ServerEngine {
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    emit: (eventName: string | symbol, ...args: any[]) => boolean
    gameEngine: GameEngine
    io: Server;
    db: JsonDB;
    constructor(io: Server) {
        this.io = io
        const eventEmitter: EventEmitter = new EventEmitter();
        this.gameEngine = new GameEngine({ ticksPerSecond: 30 }, eventEmitter)
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)

        this.db = new JsonDB(new Config("world", true, true, '/'));
        this.loadWorld();

        //don't do this until after the db loads maybe?
        //start the gameengines clock thingy
        this.gameEngine.start()

        this.on(CONSTANTS.SERVER_CHARACTER_UPDATE, (characters: Character[]) => {
            //   console.log('serverengine SERVER_CHARACTER_UPDATE')
            //TODO only 
            this.sendAndSaveCharacterUpdates(characters);

        })

        io.on(CONSTANTS.CONNECTION, socket => {
            //console.log(CONNECTION, socket.id) 

            socket.on(CONSTANTS.CREATE_CHARACTER, () => {
                //  console.log('world CREATE_CHARACTER')
                this.createCharacter();
            })
            socket.on(CONSTANTS.TURN_LEFT, async (characters: Character[]) => {
                this.gameEngine.turnLeft(characters)
            })
            socket.on(CONSTANTS.TURN_RIGHT, async (characters: Character[]) => {
                this.emit(CONSTANTS.TURN_RIGHT, characters)
            })
            socket.on(CONSTANTS.TURN_STOP, async (characters: Character[]) => {
                this.emit(CONSTANTS.TURN_STOP, characters)
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
                const updatedCharacters = this.gameEngine.createCommunity(options)
                //  console.log(updatedCharacters)
                io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, updatedCharacters)
            })

            socket.on(CONSTANTS.DISCONNECT, (reason: string) => {
                // ...
                console.log(CONSTANTS.DISCONNECT, socket.id)
                //remove the character from the database
                //db.delete('/pc/' + socket.id)
                //broadcast the removal
                //socket.broadcast.emit(PC_DISCONNECT, socket.id)
            });

            //tell the client where all the character are
            socket.on(CONSTANTS.CLIENT_CHARACTER_UPDATE, (viewPort: { top: number, bottom: number, left: number, right: number }) => {
                // ...
                socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, this.gameEngine.gameWorld.getCharactersWithin(viewPort))
            });
        })
    }

    private createCharacter() {
        console.log('ServerEngine createCharacter')
        let x = this.gameEngine.roll({ size: 30, modifier: -15 });
        let y = this.gameEngine.roll({ size: 30, modifier: -15 });
        const c = this.gameEngine.createCharacter({ x: x, y: y });
        this.sendAndSaveCharacterUpdates([c])
    }

    private loadWorld() {
        try {
            this.db.load().then(() => {
                this.db.getObject<{}>(CONSTANTS.CHARACTER_PATH).then((c: {}) => {
                    //  console.log(c);
                    //  [index: string]: string
                    const characters: Map<string, Character> = new Map<string, Character>()

                    // @ts-check
                    Object.entries(c).map(([id, character]: [id: string, character: any]) => {
                        characters.set(id, new Character(character))

                    });
                    this.gameEngine.gameWorld.updateCharacters(characters)
                }).catch(err => {
                    //console.log('empty database')
                });
            });
        }
        catch (e) {
            //console.log('failed to load')
        }
    }

    private sendAndSaveCharacterUpdates(characters: Character[]) {
        //TODO only send character updates to the rooms they're in
        this.io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, characters);

        characters.forEach((character) => {
            try {
                //array version
                this.db.push(CONSTANTS.CHARACTER_PATH + character.id, character);
            }
            catch (e) {
                console.log('failed to create character');
            }
        });

    }
}