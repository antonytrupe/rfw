import EventEmitter from "events"
import GameEngine from "@/GameEngine"
import * as CONSTANTS from "@/CONSTANTS";
import Character from "@/Character";
import { Config, JsonDB } from "node-json-db";
import { Server } from "socket.io";


export default class ServerEngine {
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    emit: (eventName: string | symbol, ...args: any[]) => boolean
    //gameEngine: GameEngine 
    constructor(io: Server) {

        const eventEmitter: EventEmitter = new EventEmitter();
        //maybe need to bind to this instead?
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        const db = new JsonDB(new Config("world", true, true, '/'));
        try {
            db.load()
        }
        catch (e) {
            console.log('failed to load')
        }

        // initialize the gameengine/gameworld
        const characters: Character[] = []

        db.getObject<{}>(CONSTANTS.CHARACTER_PATH).then((c: {}) => {
            //@ts-ignore
            Object.entries(c).forEach(([id, character]: [id: string, character: Character]) => {
                //console.log('id', id)
                //console.log('character', character)
                characters.push(new Character(character))

            })
        }).catch(err => {
            console.log('empty database')
        })
        const gameEngine = new GameEngine(eventEmitter, characters)

        //TODO start the gameengines clock thingy

        this.on(CONSTANTS.SERVER_CHARACTER_UPDATE, (character: Character) => {
            //console.log('serverengine SERVER_CHARACTER_UPDATE')
            try {
                db.push(CONSTANTS.CHARACTER_PATH + character.id, character)
            }
            catch (e) {
                console.log('failed to create character')
            }

            //  get the save sent out to browser clients somehow
            io.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, character)
        })

        io.on(CONSTANTS.CONNECTION, socket => {
            //console.log(CONNECTION, socket.id)


            socket.on(CONSTANTS.CREATE_CHARACTER, () => {
                //console.log('world CREATE_CHARACTER')
                //tell the server engine to create a new character
                this.emit(CONSTANTS.CREATE_CHARACTER)
            })

            socket.on(CONSTANTS.TURN_STOP, async (characters: Character[]) => {
                //TODO
            })

            socket.on(CONSTANTS.STOP_ACCELERATE, async (characters: Character[]) => {
                //TODO 
            })

            socket.on(CONSTANTS.ACCELERATE, async (characters: Character[]) => {
                //TODO
            })

            socket.on(CONSTANTS.DECELERATE, async (characters: Character[]) => {
                //TODO
            })

            socket.on(CONSTANTS.TURN_LEFT, async (characters: Character[]) => {
                //TODO
            })

            socket.on(CONSTANTS.TURN_RIGHT, async (characters: Character[]) => {
                //TODO
            })

            socket.on(CONSTANTS.DISCONNECT, (reason: string) => {
                // ...
                console.log(CONSTANTS.DISCONNECT, socket.id)
                //remove the character from the database
                //db.delete('/pc/' + socket.id)
                //broadcast the removal
                //socket.broadcast.emit(PC_DISCONNECT, socket.id)
            });

            //tell the client where all the other character are
            gameEngine.gameWorld.characters.forEach((character) => {
                //console.log('character', character)
                socket.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, character)
            })
        })


    }
}