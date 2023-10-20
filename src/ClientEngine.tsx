"use client"
import EventEmitter from "events";
 import { Socket, io } from "socket.io-client";
import { ACCELERATE, CONNECT, CREATE_PC, DECELERATE, DISCONNECT, PC_CURRENT, PC_DISCONNECT, PC_JOIN, CHARACTER_LOCATION, TURN_LEFT, TURN_RIGHT } from "./CONSTANTS";
import GameEngine from "./GameEngine";

export default class ClientEngine {

    socket: Socket | undefined;
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    emit: (eventName: string | symbol, ...args: any[]) => boolean;

    constructor(eventEmitter: EventEmitter) {
        console.log('ClientEngine.constructor')
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        document?.addEventListener('keydown', this.keyboardHandler.bind(this))
    }

    createPC() {
        //tell the server to create a new PC
        this.socket?.emit(CREATE_PC)
    }

    keyboardHandler(e: any) {
        const code = e.code

        if (code == 'KeyD') {
            console.log('emit', TURN_RIGHT)
            this.emit(TURN_RIGHT, TURN_RIGHT)
        }
        else if (code == 'KeyA') {
            console.log('emit', TURN_LEFT)
            this.emit(TURN_LEFT, TURN_LEFT)
        }
        else if (code == 'KeyS') {
            console.log('emit', DECELERATE)
            this.emit(DECELERATE, DECELERATE)
        }
        else if (code == 'KeyW') {
            console.log('emit', ACCELERATE)
            this.emit(ACCELERATE, ACCELERATE)
        }
    }

    async connect() {

        await fetch('/api/world');
        this.socket = io()
        this.socket.on(CONNECT, () => {

            //console.log('world connected')
            console.log(CONNECT, this.socket?.id)
            //setSocketId(socket?.id)

            //disconnect handler
            this.socket?.on(DISCONNECT, (reason) => {
                console.log('DISCONNECT', this.socket?.id);
            });

            //pc disconnect
            this.socket?.on(PC_DISCONNECT, (playerId) => {
                console.log('PC_DISCONNECT', playerId);
                //dispatch(removePlayer(playerId))
            })

            //pc join
            this.socket?.on(PC_JOIN, (player) => {
                console.log('PC_JOIN', player)
                //dispatch(addPlayer(player))
            })

            //pc current
            this.socket?.on(PC_CURRENT, (player) => {
                console.log('PC_CURRENT', player)
                //dispatch(setCurrentPlayer(player))
            })

            //pc location data
            this.socket?.on(CHARACTER_LOCATION, (player) => {
                 console.log('PC_LOCATION', player)
                //TODO 
                this.emit(CHARACTER_LOCATION,player)
            })
        })
    }
}