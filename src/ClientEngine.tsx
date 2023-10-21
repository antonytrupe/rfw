"use client"
import EventEmitter from "events";
import { Socket, io } from "socket.io-client";
import { ACCELERATE, CONNECT, CREATE_CHARACTER, DECELERATE, DISCONNECT, PC_CURRENT, PC_DISCONNECT, PC_JOIN, CHARACTER_LOCATION, TURN_LEFT, TURN_RIGHT, STOP_ACCELERATE, TURN_STOP } from "./CONSTANTS";
import GameEngine from "./GameEngine";
import Character from "../app/Character";

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
        console.log('ClientEngine.constructor')
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
        // console.log('draw')
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

            ctx.fillStyle = this.selectedCharacters.some((selectedCharacter) => { return selectedCharacter.id == character.id }) ? '#009900' : '#000000'

            ctx.beginPath()
            ctx.arc(character.x, character.y, character.size, 0, 2 * Math.PI)
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
       // console.log(this.selectedCharacters)
    }

    keyDownHandler(e: KeyboardEvent) {
        const code = e.code

        if (code == 'KeyD') {
            console.log('emit', TURN_RIGHT)
            if (this.selectedCharacters) {
                this.emit(TURN_RIGHT, this.selectedCharacters)
                //this.socket?.emit(TURN_RIGHT,this.selectedCharacters)
            }
        }
        else if (code == 'KeyA') {
            console.log('emit', TURN_LEFT)
            if (this.selectedCharacters) {
                this.emit(TURN_LEFT, this.selectedCharacters)
                //this.socket?.emit(TURN_LEFT,this.selectedCharacters)
            }
        }
        else if (code == 'KeyS') {
            //console.log('emit', DECELERATE)
            if (this.selectedCharacters) {
                this.emit(DECELERATE, this.selectedCharacters)
                //this.socket?.emit(DECELERATE,this.selectedCharacters
            }
        }
        else if (code == 'KeyW') {
            //console.log('ClientEngine emit', 'ACCELERATE')
            if (this.selectedCharacters) {
                this.emit(ACCELERATE, this.selectedCharacters)
                //this.socket?.emit(ACCELERATE,this.selectedCharacters)
            }
        }
    }

    keyUpHandler(e: KeyboardEvent) {
        const code = e.code

        if (code == 'KeyD') {
            //console.log('emit', TURN_STOP)
            if (this.selectedCharacters) {
                this.emit(TURN_STOP, this.selectedCharacters)
                //this.socket?.emit(TURN_STOP,this.selectedCharacters)
            }
        }
        else if (code == 'KeyA') {
            // console.log('emit', TURN_STOP)
            if (this.selectedCharacters) {
                this.emit(TURN_STOP, this.selectedCharacters)
                //this.socket?.emit(TURN_STOP,this.selectedCharacters)
            }
        }
        else if (code == 'KeyS') {
            //console.log('emit', 'STOP_ACCELERATE')
            if (this.selectedCharacters) {
                this.emit(STOP_ACCELERATE, this.selectedCharacters)
                //this.socket?.emit(DECELERATE,this.selectedCharacters
            }
        }
        else if (code == 'KeyW') {
            console.log('ClientEngine emit', 'STOP_ACCELERATE')
            if (this.selectedCharacters) {
                this.emit(STOP_ACCELERATE, this.selectedCharacters)
                //this.socket?.emit(ACCELERATE,this.selectedCharacters)
            }
        }
    }

    async connect() {
        //console.log('Client Engine connect')

        await fetch('/api/world')
        this.socket = io()
        this.socket.on(CONNECT, () => {
            this.connected = true

            //console.log('world connected')
            //console.log('CONNECT on ', this.socket?.id)
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
            this.socket?.on(PC_JOIN, (character: Character) => {
                console.log('PC_JOIN', character)
                //dispatch(addPlayer(player))
            })

            //pc current
            this.socket?.on(PC_CURRENT, (character: Character) => {
                console.log('PC_CURRENT', character)
                //dispatch(setCurrentPlayer(player))
            })

            //pc location data
            this.socket?.on(CHARACTER_LOCATION, (character: Character) => {
                //console.log('socket on PC_LOCATION', character)
                //TODO 
                this.emit(CHARACTER_LOCATION, character)
            })
        })
    }
}