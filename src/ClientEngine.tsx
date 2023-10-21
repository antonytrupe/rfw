"use client"
import EventEmitter from "events";
import { Socket, io } from "socket.io-client";
import { ACCELERATE, CONNECT, CREATE_CHARACTER, DECELERATE, DISCONNECT, PC_CURRENT, PC_DISCONNECT, PC_JOIN, CHARACTER_LOCATION, TURN_LEFT, TURN_RIGHT } from "./CONSTANTS";
import GameEngine from "./GameEngine";
import { Character } from "../app/worldSlice";

export default class ClientEngine {
    selectedCharacters: Character[] = [];
    stop() {
        this.stopped = true;
    }
    disconnect() {
        this.socket?.disconnect()
        return true;
    }

    socket: Socket | undefined
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    emit: (eventName: string | symbol, ...args: any[]) => boolean
    stopped: boolean = false

    gameEngine: GameEngine
    getCanvas: (() => HTMLCanvasElement);
    connected: boolean = false

    constructor(eventEmitter: EventEmitter, gameEngine: GameEngine, getCanvas: (() => HTMLCanvasElement)) {
        // console.log('ClientEngine.constructor')
        this.getCanvas = getCanvas
        this.gameEngine = gameEngine
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)

        let renderLoop = (timestamp: DOMHighResTimeStamp) => {
            if (this.stopped) {
                return
            }
            this.gameEngine.step()
            this.draw()
            window.requestAnimationFrame(renderLoop)
        }
        window.requestAnimationFrame(renderLoop)
    }

    draw() {
        //throw new Error("Method not implemented.")
        if (!this.getCanvas) { return }
        //console.log('draw')
        const canvas: HTMLCanvasElement | null = this.getCanvas()
        if (!canvas) { return }
        //@ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
        ctx.canvas.width = window.innerWidth
        ctx.canvas.height = window.innerHeight

        // Store the current transformation matrix
        ctx.save()

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Restore the transform
        ctx.restore()

        this.gameEngine.gameWorld.characters.forEach((character: Character) => {
            ctx.fillStyle = this.selectedCharacters.includes(character) ? '#009900' : '#000000'

            ctx.beginPath()
            ctx.arc(character.location.x, character.location.y, character.size, 0, 2 * Math.PI)
            ctx.fill()
        })
    }

    createCharacter() {
        //console.log('ClientEngine.createCharacter')
        //tell the server to create a new PC
        this.socket?.emit(CREATE_CHARACTER)
    }

    clickHandler(e: MouseEvent) {
        const rect = this.getCanvas().getBoundingClientRect()
        const characters = this.gameEngine.gameWorld.findCharacters({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        this.selectedCharacters = characters
    }

    keyDownHandler(e: KeyboardEvent) {
        const code = e.code

        if (code == 'KeyD') {
            console.log('emit', TURN_RIGHT)
            this.emit(TURN_RIGHT, TURN_RIGHT)
            this.socket?.emit(TURN_RIGHT)
        }
        else if (code == 'KeyA') {
            console.log('emit', TURN_LEFT)
            this.emit(TURN_LEFT, TURN_LEFT)
            this.socket?.emit(TURN_LEFT)
        }
        else if (code == 'KeyS') {
            console.log('emit', DECELERATE)
            this.emit(DECELERATE, DECELERATE)
            this.socket?.emit(DECELERATE)
        }
        else if (code == 'KeyW') {
            console.log('emit', ACCELERATE)
            this.emit(ACCELERATE, ACCELERATE)
            this.socket?.emit(ACCELERATE)
        }
    }

    async connect() {
        //console.log('Client Engine connect')

        await fetch('/api/world')
        this.socket = io()
        this.socket.on(CONNECT, () => {
            this.connected = true

            //console.log('world connected')
            console.log('CONNECT on ', this.socket?.id)
            //setSocketId(socket?.id)

            //disconnect handler
            this.socket?.on(DISCONNECT, (reason) => {
                console.log('DISCONNECT', this.socket?.id)
                this.connected = false
            })

            //pc disconnect
            this.socket?.on(PC_DISCONNECT, (playerId) => {
                console.log('PC_DISCONNECT', playerId)
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
                //console.log('PC_LOCATION', player)
                //TODO 
                this.emit(CHARACTER_LOCATION, player)
            })
        })
    }
}