"use client"
import EventEmitter from "events";
import { Socket, io } from "socket.io-client";
import {
    ACCELERATE, CONNECT, CREATE_CHARACTER, DECELERATE, DISCONNECT, PC_CURRENT, PC_DISCONNECT, PC_JOIN,
    CHARACTER_LOCATION, TURN_LEFT, TURN_RIGHT, STOP_ACCELERATE, TURN_STOP, CLIENT_UPDATE, DECELERATE_DOUBLE, ACCELERATE_DOUBLE, STOP_DOUBLE_ACCELERATE
} from "./CONSTANTS";
import GameEngine from "./GameEngine";
import Character from "../app/Character";

export default class ClientEngine {
    selectedCharacters: Character[] = [];
    ratio: number = 1
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
        //this.drawInit()
        window.requestAnimationFrame(renderLoop.bind(this))
    }

    scaleStyle(ctx: CanvasRenderingContext2D) {
        ctx.font = 18 * this.ratio + "px Arial";
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1 * this.ratio;
    }

    drawTurnScale(ctx: CanvasRenderingContext2D) {
        const xOffset = 10
        const yOffset = 10
        ctx.save()
        ctx.translate(xOffset * this.ratio, yOffset * this.ratio)
        const ticks = 6
        const tickSize = 5
        ctx.beginPath()
        //horizontal line
        ctx.moveTo(0, 0)
        ctx.lineTo(0 + ticks * tickSize * this.PIXELS_TO_FOOT, 0)
        this.scaleStyle(ctx);

        //tick marks
        [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
            ctx.moveTo(i * tickSize * this.PIXELS_TO_FOOT, 0)
            ctx.lineTo(i * tickSize * this.PIXELS_TO_FOOT, 10 * this.ratio)
            ctx.fillText(i * tickSize + 'ft', i * tickSize * this.PIXELS_TO_FOOT, 25 * this.ratio)
            ctx.fillText(i * tickSize / 5 + 's', i * tickSize * this.PIXELS_TO_FOOT, 45 * this.ratio)
        })

        ctx.stroke()
        ctx.restore()
    }

    drawMinuteScale(ctx: CanvasRenderingContext2D) {
        const xOffset = 10
        const yOffset = 10
        const ticks = 10
        const tickSize = 1
        ctx.save()
        ctx.translate(xOffset * this.ratio, yOffset * this.ratio)
        this.scaleStyle(ctx);
        ctx.beginPath()
        //horizontal line
        ctx.moveTo(0, 0)
        ctx.lineTo(ticks * 30 * this.PIXELS_TO_FOOT, 0);

        //tick marks
        [0, 1, 3, 5, 10].forEach((i) => {
            ctx.moveTo(i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 0)
            ctx.lineTo(i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 10 * this.ratio)
            ctx.fillText(i * (ticks / tickSize) * 3 + 'ft', i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 25 * this.ratio)
            ctx.fillText(i * (ticks / tickSize) * 3 / 5 + 's', i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 45 * this.ratio)
        })

        ctx.stroke()
        ctx.restore()
    }

    PIXELS_TO_FOOT = 10

    drawHourScale(ctx: CanvasRenderingContext2D) {
        const xOffset = 10
        const yOffset = 10
        const ticks = 60
        const tickSize = 1
        ctx.save()
        ctx.translate(xOffset * this.ratio, yOffset * this.ratio)
        this.scaleStyle(ctx);

        ctx.beginPath()
        //horizontal line
        ctx.moveTo(0, 0)
        ctx.lineTo(+ (ticks / tickSize) * 300 * this.PIXELS_TO_FOOT, 0);

        //tick marks
        [0, 1, 3, 5, 10].forEach((i) => {
            ctx.moveTo(i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 0)
            ctx.lineTo(i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 10 * this.ratio)
            ctx.fillText(i * 5 * (ticks / tickSize) + 'ft', i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 25 * this.ratio)
            ctx.fillText(i * tickSize + 'm', i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 45 * this.ratio)
        })
        ctx.stroke()
        ctx.restore()
    }

    draw() {
        if (!this.getCanvas) { return }
        const canvas: HTMLCanvasElement | null = this.getCanvas()
        if (!canvas) { return }
        //@ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

        {
            // Store the current transformation matrix
            ctx.save()

            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

            // Restore the transform
            ctx.restore()
        }

        ctx.setTransform(1 / this.ratio, 0, 0, 1 / this.ratio, 0, 0)

        //draw the scale
        if (this.ratio <= 2) {
            this.drawTurnScale(ctx)
        }
        else if (this.ratio <= 8) {
            this.drawMinuteScale(ctx)
        }
        else {
            this.drawHourScale(ctx)
        }

        //draw all the characters
        this.gameEngine.gameWorld.characters.forEach((character: Character) => {

            ctx.save()
            ctx.translate(character.x * this.PIXELS_TO_FOOT, character.y * this.PIXELS_TO_FOOT)
            ctx.rotate(character.direction)

            ctx.fillStyle = this.selectedCharacters.some((selectedCharacter) => {
                return selectedCharacter.id == character.id
            }) ? '#009900' : '#000000'

            ctx.beginPath()
            ctx.arc(0, 0, character.size * this.PIXELS_TO_FOOT / 2, 0, 2 * Math.PI)
            ctx.fill()

            //draw an arrow
            ctx.beginPath()
            ctx.strokeStyle = '#FFFFFF'

            ctx.moveTo(0, - (character.size) + 1)
            ctx.lineTo(0, (character.size) - 1)

            ctx.stroke()

            ctx.restore()
        })
    }

    createCharacter() {
        //console.log('ClientEngine.createCharacter')
        //tell the server to create a new PC
        this.socket?.emit(CREATE_CHARACTER)
    }

    clickHandler(e: MouseEvent) {
        const rect = this.getCanvas().getBoundingClientRect()
        const characters = this.gameEngine.gameWorld.findCharacters(
            {
                x: (e.clientX - rect.left) * this.ratio / this.PIXELS_TO_FOOT,
                y: (e.clientY - rect.top) * this.ratio / this.PIXELS_TO_FOOT
            })
        this.selectedCharacters = characters
        this.emit(CLIENT_UPDATE, this.selectedCharacters)
    }

    wheelHandler(e: WheelEvent) {
        this.ratio = Math.min(Math.max(.5, this.ratio + e.deltaY / 1000), 100)
        console.log(this.ratio)
    }

    keyDownHandler(e: KeyboardEvent) {
        const code = e.code

        if (code == 'KeyD') {
            if (this.selectedCharacters) {
                this.emit(TURN_RIGHT, this.selectedCharacters)
                this.socket?.emit(TURN_RIGHT, this.selectedCharacters)
            }
        }
        else if (code == 'KeyA') {
            if (this.selectedCharacters) {
                this.emit(TURN_LEFT, this.selectedCharacters)
                this.socket?.emit(TURN_LEFT, this.selectedCharacters)
            }
        }
        else if (code == 'KeyS') {
            if (this.selectedCharacters) {
                //if holding shift then double fast goer
                this.emit(  DECELERATE, this.selectedCharacters)
                this.socket?.emit(  DECELERATE, this.selectedCharacters)
            }
        }
        else if (code == 'KeyW') {
            if (this.selectedCharacters) {
                //if holding shift then double fast goer
                this.emit(  ACCELERATE, this.selectedCharacters)
                this.socket?.emit(  ACCELERATE, this.selectedCharacters)
            }
        }
        else if (code == "ShiftLeft") {
            if (this.selectedCharacters) {
                this.emit(ACCELERATE_DOUBLE, this.selectedCharacters)
                this.socket?.emit(ACCELERATE_DOUBLE, this.selectedCharacters)
            }
        }
    }

    keyUpHandler(e: KeyboardEvent) {
        const code = e.code
        //console.log(e)

        if (code == 'KeyD') {
            if (this.selectedCharacters) {
                this.emit(TURN_STOP, this.selectedCharacters)
                this.socket?.emit(TURN_STOP, this.selectedCharacters)
            }
        }
        else if (code == 'KeyA') {
            if (this.selectedCharacters) {
                this.emit(TURN_STOP, this.selectedCharacters)
                this.socket?.emit(TURN_STOP, this.selectedCharacters)
            }
        }
        else if (code == 'KeyS') {
            if (this.selectedCharacters) {
                this.emit(STOP_ACCELERATE, this.selectedCharacters)
                this.socket?.emit(STOP_ACCELERATE, this.selectedCharacters)
            }
        }
        else if (code == 'KeyW') {
            if (this.selectedCharacters) {
                this.emit(STOP_ACCELERATE, this.selectedCharacters)
                this.socket?.emit(STOP_ACCELERATE, this.selectedCharacters)
            }
        }
        else if (code == "ShiftLeft") {
            if (this.selectedCharacters) {
                this.emit(STOP_DOUBLE_ACCELERATE, this.selectedCharacters)
                this.socket?.emit(STOP_DOUBLE_ACCELERATE, this.selectedCharacters)
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