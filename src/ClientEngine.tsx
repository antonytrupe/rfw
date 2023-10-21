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
        //console.log('ClientEngine.constructor')
        this.getCanvas = getCanvas
        this.gameEngine = gameEngine
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)

        let renderLoop = (timestamp: DOMHighResTimeStamp) => {
            if (this.stopped) {
                return
            }
            // this.gameEngine.step()
            this.draw()
            window.requestAnimationFrame(renderLoop.bind(this))
        }
        this.gameEngine.start()
        window.requestAnimationFrame(renderLoop.bind(this))
    }
    drawScale(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        //horizontal line
        ctx.moveTo(10, 10)
        ctx.lineTo(310, 10)
        //0 tick
        ctx.moveTo(10, 5)
        ctx.lineTo(10, 15)
        //30 tick
        ctx.moveTo(40, 5)
        ctx.lineTo(40, 15)
        //60 tick
        ctx.moveTo(70, 5)
        ctx.lineTo(70, 15)
        //90 tick
        ctx.moveTo(100, 5)
        ctx.lineTo(100, 15)


        //90 tick
        ctx.moveTo(310, 5)
        ctx.lineTo(310, 15)

        ctx.stroke()
        ctx.font = "12px Arial";
        ctx.strokeText('30ft', 30, 25)
        ctx.strokeText('6s', 30, 40)
        ctx.strokeText('60ft', 60, 25)
        ctx.strokeText('90ft', 90, 25)

        ctx.strokeText('600ft', 300, 25)
        ctx.strokeText('60s', 300, 40)

    }

    draw() {
        if (!this.getCanvas) { return }
        const canvas: HTMLCanvasElement | null = this.getCanvas()
        if (!canvas) { return }
        //@ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
        //const ratio = window.devicePixelRatio=4
        //console.log(canvas)

        //todo should this be inside the save/restore block?

        const width: any = canvas.style.width
        const height: any = canvas.style.height
        //console.log(canvas.style.width)
        //canvas.width = Math.floor(width * ratio)
        //canvas.height = Math.floor(height * ratio)
        //ctx.scale(ratio, ratio);

        {
            // Store the current transformation matrix
            ctx.save()

            //this.drawInit( )
            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

            // Restore the transform
            ctx.restore()
        }

        //draw the scale
        this.drawScale(ctx)

        //draw all the characters
        this.gameEngine.gameWorld.characters.forEach((character: Character) => {

            ctx.fillStyle = this.selectedCharacters.some((selectedCharacter) => { return selectedCharacter.id == character.id }) ? '#009900' : '#000000'

            ctx.beginPath()
            ctx.arc(character.x, character.y, character.size/2, 0, 2 * Math.PI)
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
        //console.log(e)

        if (code == 'KeyD') {
            //console.log('emit', TURN_RIGHT)
            if (this.selectedCharacters) {
                this.emit(TURN_RIGHT, this.selectedCharacters)
                //this.socket?.emit(TURN_RIGHT,this.selectedCharacters)
            }
        }
        else if (code == 'KeyA') {
            //console.log('emit', TURN_LEFT)
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
        //console.log(e)

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
            // console.log('ClientEngine emit', 'STOP_ACCELERATE')
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