"use client"
import EventEmitter from "events";
import { Socket, io } from "socket.io-client";
import GameEngine from "@/GameEngine";
import Character from "./Character";
import * as CONSTANTS from "@/CONSTANTS";

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

    PIXELS_TO_FOOT = 20

    constructor(eventEmitter: EventEmitter, getCanvas: (() => HTMLCanvasElement)) {
        //console.log('ClientEngine.constructor')
        this.getCanvas = getCanvas
        this.gameEngine = new GameEngine({ ticksPerSecond: 30 }, eventEmitter)
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)

        let renderLoop = () => {
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

    wheelHandler(e: WheelEvent) {
        let zoom = e.deltaY / 1000
        console.log(zoom)

        const rect = this.getCanvas().getBoundingClientRect()
        let mouseX = this.mouseX(e, rect)
        let mouseY = this.mouseY(e, rect)
        console.log('mouseX', mouseX)
        console.log('mouseY', mouseY)

        console.log('this.translateX', this.translateX)
        console.log('this.translateY', this.translateY)


        //  let left = (rect.left) * this.scale / this.PIXELS_TO_FOOT
        //  let top = (rect.top) * this.scale / this.PIXELS_TO_FOOT
        // console.log('left',left)
        // console.log('top',top)

        let deltax = (mouseX - this.translateX) * zoom
        let deltaY = (mouseY - this.translateY) * zoom
        console.log('deltax', deltax)
        console.log('deltaY', deltaY)

        this.translateX -= deltax
        this.translateY -= deltaY

        this.scale = Math.min(Math.max(1, this.scale + zoom), 100)
        // console.log('scale', this.scale)
    }

    draworigincrosshairs(ctx: CanvasRenderingContext2D) {
        let center = 0
        let length = 20
        ctx.save();
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1 * this.scale;
        //vertical line
        ctx.moveTo(
            center * this.PIXELS_TO_FOOT,
            -length / 2 * this.PIXELS_TO_FOOT + center * this.PIXELS_TO_FOOT);
        ctx.lineTo(
            center * this.PIXELS_TO_FOOT,
            length / 2 * this.PIXELS_TO_FOOT + center * this.PIXELS_TO_FOOT);

        //horizontal line
        ctx.moveTo(
            -length / 2 * this.PIXELS_TO_FOOT + center * this.PIXELS_TO_FOOT,
            center * this.PIXELS_TO_FOOT);
        ctx.lineTo(
            length / 2 * this.PIXELS_TO_FOOT + center * this.PIXELS_TO_FOOT,
            center * this.PIXELS_TO_FOOT);
        ctx.stroke()

        ctx.restore();
    }
    translateX = -20
    translateY = -20
    scale: number = 2

    draw() {
        if (!this.getCanvas) { return }
        const canvas: HTMLCanvasElement | null = this.getCanvas()
        if (!canvas) { return }
        //@ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
 
        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      
      
        //TODO this probably isn't right yet 
        ctx.translate(-this.translateX * this.PIXELS_TO_FOOT, -this.translateY * this.PIXELS_TO_FOOT)
        ctx.scale(1 / this.scale, 1 / this.scale);
      
        //draw the scale
        if (this.scale <= 2) {
            this.drawTurnScale(ctx)
        }
        else if (this.scale <= 8) {
            this.drawMinuteScale(ctx)
        }
        else {
            this.drawHourScale(ctx)
        }

        this.draworigincrosshairs(ctx)

        //draw all the characters
        this.gameEngine.gameWorld.characters.forEach((character: Character) => {

            this.drawCharacter(ctx, character);
        })
    } 

    scaleStyle(ctx: CanvasRenderingContext2D) {
        ctx.font = 18 * this.scale + "px Arial";
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1 * this.scale;
    }

    drawTurnScale(ctx: CanvasRenderingContext2D) {
        const xOffset = 10
        const yOffset = 10
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.translate(xOffset, yOffset)
        ctx.scale(1 / this.scale, 1 / this.scale);
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
            ctx.lineTo(i * tickSize * this.PIXELS_TO_FOOT, 10 * this.scale)
            ctx.fillText(i * tickSize + 'ft', i * tickSize * this.PIXELS_TO_FOOT, 25 * this.scale)
            ctx.fillText(i * tickSize / 5 + 's', i * tickSize * this.PIXELS_TO_FOOT, 45 * this.scale)
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
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.translate(xOffset, yOffset)
        ctx.scale(1 / this.scale, 1 / this.scale);
        this.scaleStyle(ctx);
        ctx.beginPath()
        //horizontal line
        ctx.moveTo(0, 0)
        ctx.lineTo(ticks * 30 * this.PIXELS_TO_FOOT, 0);

        //tick marks
        [0, 1, 3, 5, 10].forEach((i) => {
            ctx.moveTo(i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 0)
            ctx.lineTo(i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 10 * this.scale)
            ctx.fillText(i * (ticks / tickSize) * 3 + 'ft', i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 25 * this.scale)
            ctx.fillText(i * (ticks / tickSize) * 3 / 5 + 's', i * (ticks / tickSize) * 3 * this.PIXELS_TO_FOOT, 45 * this.scale)
        })

        ctx.stroke()
        ctx.restore()
    }

    drawHourScale(ctx: CanvasRenderingContext2D) {
        const xOffset = 10
        const yOffset = 10
        const ticks = 60
        const tickSize = 1
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.translate(xOffset, yOffset)
        ctx.scale(1 / this.scale, 1 / this.scale);
        this.scaleStyle(ctx);

        ctx.beginPath()
        //horizontal line
        ctx.moveTo(0, 0)
        ctx.lineTo((ticks / tickSize) * 300 * this.PIXELS_TO_FOOT, 0);

        //tick marks
        [0, 1, 3, 5, 10].forEach((i) => {
            ctx.moveTo(i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 0)
            ctx.lineTo(i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 10 * this.scale)
            ctx.fillText(i * 5 * (ticks / tickSize) + 'ft', i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 25 * this.scale)
            ctx.fillText(i * tickSize + 'm', i * (ticks / tickSize) * 5 * this.PIXELS_TO_FOOT, 45 * this.scale)
        })
        ctx.stroke()
        ctx.restore()
    } 

    private drawCharacter(ctx: CanvasRenderingContext2D, character: Character) {
        ctx.save();
        ctx.translate(character.x * this.PIXELS_TO_FOOT, character.y * this.PIXELS_TO_FOOT);
        ctx.rotate(character.direction);

        ctx.fillStyle = this.selectedCharacters.some((selectedCharacter) => {
            return selectedCharacter.id == character.id;
        }) ? '#009900' : '#000000';

        ctx.beginPath();
        ctx.arc(0, 0, character.size * this.PIXELS_TO_FOOT / 2, 0, 2 * Math.PI);
        ctx.fill();

        //draw an arrow
        ctx.beginPath();
        ctx.strokeStyle = '#FFFFFF';

        ctx.moveTo(0, -(character.size) + 1);
        ctx.lineTo(0, (character.size) - 1);

        ctx.stroke();

        ctx.restore();
    }

    createCharacter() {
        //console.log('ClientEngine.createCharacter')
        //tell the server to create a new PC
        this.socket?.emit(CONSTANTS.CREATE_CHARACTER)
    }

    clickHandler(e: MouseEvent) {
        const rect = this.getCanvas().getBoundingClientRect()
        //  console.log('left',rect.left)
        //  console.log('top',rect.top)

        //console.log('click x', this.mouseX(e, rect))
        //console.log('click y', this.mouseY(e, rect))
        const characters = this.gameEngine.gameWorld.findCharacters(
            {
                x: this.mouseX(e, rect),
                y: this.mouseY(e, rect)
            })
        this.selectedCharacters = characters
        //tell the ui about the selected characters
        this.emit(CONSTANTS.CLIENT_SELECTED_CHARACTERS, this.selectedCharacters)
    }

    private mouseX(e: MouseEvent, rect: DOMRect): number {
        const x = ((e.clientX - rect.left) + (this.PIXELS_TO_FOOT * this.translateX)) / this.PIXELS_TO_FOOT
        console.log('x', x)
        return x;
    }

    private mouseY(e: MouseEvent, rect: DOMRect): number {
        const y = ((e.clientY - rect.top) + (this.PIXELS_TO_FOOT * this.translateY)) / this.PIXELS_TO_FOOT
        console.log('y', y)
        return y;
    }

    keyDownHandler(e: KeyboardEvent) {
        const code = e.code

        if (code == 'KeyD') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.TURN_RIGHT, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.TURN_RIGHT, this.selectedCharacters)
            }
        }
        else if (code == 'KeyA') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.TURN_LEFT, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.TURN_LEFT, this.selectedCharacters)
            }
        }
        else if (code == 'KeyS') {
            if (this.selectedCharacters) {
                //if holding shift then double fast goer
                this.emit(CONSTANTS.DECELERATE, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.DECELERATE, this.selectedCharacters)
            }
        }
        else if (code == 'KeyW') {
            if (this.selectedCharacters) {
                //if holding shift then double fast goer
                this.emit(CONSTANTS.ACCELERATE, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.ACCELERATE, this.selectedCharacters)
            }
        }
        else if (code == "ShiftLeft") {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.ACCELERATE_DOUBLE, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.ACCELERATE_DOUBLE, this.selectedCharacters)
            }
        }
    }

    keyUpHandler(e: KeyboardEvent) {
        const code = e.code
        //console.log(e)

        if (code == 'KeyD') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.TURN_STOP, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.TURN_STOP, this.selectedCharacters)
            }
        }
        else if (code == 'KeyA') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.TURN_STOP, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.TURN_STOP, this.selectedCharacters)
            }
        }
        else if (code == 'KeyS') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.STOP_ACCELERATE, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.STOP_ACCELERATE, this.selectedCharacters)
            }
        }
        else if (code == 'KeyW') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.STOP_ACCELERATE, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.STOP_ACCELERATE, this.selectedCharacters)
            }
        }
        else if (code == "ShiftLeft") {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, this.selectedCharacters)
                this.socket?.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, this.selectedCharacters)
            }
        }
    }

    async connect() {
        //console.log('Client Engine connect')

        await fetch('/api/world')
        this.socket = io()
        this.socket.on(CONSTANTS.CONNECT, () => {
            this.connected = true

            //disconnect handler
            this.socket?.on(CONSTANTS.DISCONNECT, (reason) => {
                console.log('DISCONNECT', this.socket?.id)
                this.connected = false
            })

            //pc disconnect
            this.socket?.on(CONSTANTS.PC_DISCONNECT, (playerId) => {
                console.log('PC_DISCONNECT', playerId)
                //dispatch(removePlayer(playerId))
            })

            //pc join
            this.socket?.on(CONSTANTS.PC_JOIN, (character: Character) => {
                console.log('PC_JOIN', character)
                //dispatch(addPlayer(player))
            })

            //pc current
            this.socket?.on(CONSTANTS.PC_CURRENT, (character: Character) => {
                console.log('PC_CURRENT', character)
                //dispatch(setCurrentPlayer(player))
            })

            //pc location data
            this.socket?.on(CONSTANTS.CLIENT_CHARACTER_UPDATE, (characters: Character[]) => {
                //console.log('socket on PC_LOCATION', character)
                //tell the gameengine we got an update 
                this.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, characters)
                const merged = this.selectedCharacters.map((selected) => {
                    //looping over all selected charecters
                    //look for each selected character in the list of characters
                    const u = characters.find((c) => { return c.id == selected.id; });
                    //if we didn't find it in the list of updated characters, then just use the current value
                    return { ...selected, ...u };
                });
                //tell the ui about the updates to the selected characters
                this.emit(CONSTANTS.CLIENT_SELECTED_CHARACTERS, merged)
            })
        })
    }
}