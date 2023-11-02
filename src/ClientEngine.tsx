"use client"
import EventEmitter from "events";
import { Socket, io } from "socket.io-client";
import GameEngine from "@/GameEngine";
import Character from "./Character";
import * as CONSTANTS from "@/CONSTANTS";
import { Zones } from "./GameWorld";


export default class ClientEngine {
    //event things
    socket: Socket | undefined
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    emit: (eventName: string | symbol, ...args: any[]) => boolean

    //state things
    stopped: boolean = false //control the draw loop
    connected: boolean = false
    selectedCharacters: Character[] = []
    gameEngine: GameEngine

    //react/dom things
    getCanvas: (() => HTMLCanvasElement)

    //drawing things
    PIXELS_PER_FOOT = 20
    scale: number = 1
    translateX = -20 * this.scale
    translateY = -20 * this.scale

    constructor(eventEmitter: EventEmitter, getCanvas: (() => HTMLCanvasElement)) {
        //console.log('ClientEngine.constructor')
        this.getCanvas = getCanvas
        this.gameEngine = new GameEngine({ ticksPerSecond: 30 }, eventEmitter)
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)


        const observer = new ResizeObserver(() => {
            const canvas = getCanvas()
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        });
        observer.observe(getCanvas())


        let renderLoop = () => {
            if (this.stopped) {
                return
            }
            this.draw()
            window.requestAnimationFrame(renderLoop.bind(this))
        }
        this.gameEngine.start()
        window.requestAnimationFrame(renderLoop.bind(this))
    }

    claim(characterId: string) {
        //TODO client claim
        this.socket?.emit(CONSTANTS.CLAIM_CHARACTER, characterId)
    }

    focus(characterId: string) {
        const c = this.gameEngine.gameWorld.getCharacters([characterId])[0]
        //change the zoom
        this.scale = 1
        //change the  offsets
        // const center = this.getViewPortOrigin()
        //console.log('center', center)
        const rect = this.getViewPort()
        // console.log('rect', rect)
        this.translateX = c.x - (rect.right - rect.left) / 2
        this.translateY = c.y - (rect.bottom - rect.top) / 2
    }

    wheelHandler(e: WheelEvent) {
        e.stopPropagation()
        // e.preventDefault()
        let zoom

        if (e.deltaY > 0) {
            zoom = this.scale / 10
        }
        else {
            zoom = - this.scale / 10
        }

        const mouse = this.getMousePosition(e)

        let deltaX = (this.translateX - mouse.x) * zoom / this.scale
        let deltaY = (this.translateY - mouse.y) * zoom / this.scale

        const newScale = Math.min(Math.max(1, this.scale + zoom), 100000);
        if (newScale != this.scale) {
            this.scale = newScale
            this.translateX += deltaX
            this.translateY += deltaY
            // tell the server our viewport changed
            this.socket?.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, this.getViewPort())
        }
        // console.log(this.scale)
    }

    private draw() {
        if (!this.getCanvas) { return }
        const canvas: HTMLCanvasElement | null = this.getCanvas()
        if (!canvas) { return }
        //@ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.translate(-this.translateX * this.PIXELS_PER_FOOT / this.scale, -this.translateY * this.PIXELS_PER_FOOT / this.scale)
        ctx.scale(1 / this.scale, 1 / this.scale)

        this.drawCrossHair(ctx)

        //draw all the characters
        // only get the characters from the right zones, just in case we have more data then we need to draw
        this.gameEngine.gameWorld.getCharactersWithin(this.getViewPort())
            .forEach((character: Character) => {
                this.drawCharacter(ctx, character);
            })

        //draw the scale
        if (this.scale <= 3) {
            this.drawTurnScale(ctx)
        }
        else if (this.scale <= 30) {
            this.drawMinuteScale(ctx)
        }
        else if (this.scale <= 1000) {
            this.drawHourScale(ctx)
        }
    }

    private drawCrossHair(ctx: CanvasRenderingContext2D) {
        let center = 0
        let length = 20
        ctx.save();
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1 * this.scale;
        //vertical line
        ctx.moveTo(
            center * this.PIXELS_PER_FOOT / this.scale,
            (-length / 2 + center) * this.PIXELS_PER_FOOT / this.scale)
        ctx.lineTo(
            center * this.PIXELS_PER_FOOT / this.scale,
            (length / 2 + center) * this.PIXELS_PER_FOOT / this.scale);

        //horizontal line
        ctx.moveTo(
            (-length / 2 + center) * this.PIXELS_PER_FOOT / this.scale,
            center * this.PIXELS_PER_FOOT);
        ctx.lineTo(
            (length / 2 + center) * this.PIXELS_PER_FOOT / this.scale,
            center * this.PIXELS_PER_FOOT / this.scale);
        ctx.stroke()
        ctx.restore();
    }

    private scaleStyle(ctx: CanvasRenderingContext2D) {
        ctx.font = 18 * this.scale + "px Arial";
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1 * this.scale;
    }

    private drawTurnScale(ctx: CanvasRenderingContext2D) {
        const xOffset = 10
        const yOffset = 10
        const ticks = 6
        const tickSize = 5
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.translate(xOffset, yOffset)
        ctx.scale(1 / this.scale, 1 / this.scale);
        this.scaleStyle(ctx);
        ctx.beginPath();
        //horizontal line
        ctx.moveTo(0, 0)
        ctx.lineTo(0 + ticks * tickSize * this.PIXELS_PER_FOOT, 0);

        //tick marks
        [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
            ctx.moveTo(i * tickSize * this.PIXELS_PER_FOOT, 0)
            ctx.lineTo(i * tickSize * this.PIXELS_PER_FOOT, 10 * this.scale)
            ctx.fillText(i * tickSize + 'ft', i * tickSize * this.PIXELS_PER_FOOT, 25 * this.scale)
            ctx.fillText(i + 's', i * tickSize * this.PIXELS_PER_FOOT, 45 * this.scale)
        })

        ctx.stroke()
        ctx.restore()
    }

    private drawMinuteScale(ctx: CanvasRenderingContext2D) {
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
        ctx.lineTo(ticks * 30 * this.PIXELS_PER_FOOT, 0);

        //tick marks
        [0, 1, 3, 5, 10].forEach((i) => {
            ctx.moveTo(i * (ticks / tickSize) * 3 * this.PIXELS_PER_FOOT, 0)
            ctx.lineTo(i * (ticks / tickSize) * 3 * this.PIXELS_PER_FOOT, 10 * this.scale)
            ctx.fillText(i * (ticks / tickSize) * 3 + 'ft', i * (ticks / tickSize) * 3 * this.PIXELS_PER_FOOT, 25 * this.scale)
            ctx.fillText(i * (ticks / tickSize) * 3 / 5 + 's', i * (ticks / tickSize) * 3 * this.PIXELS_PER_FOOT, 45 * this.scale)
        })

        ctx.stroke()
        ctx.restore()
    }

    private drawHourScale(ctx: CanvasRenderingContext2D) {
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
        ctx.lineTo((ticks / tickSize) * 300 * this.PIXELS_PER_FOOT, 0);

        //tick marks
        [0, 1, 5, 15, 30, 60].forEach((i) => {
            ctx.moveTo(i * (ticks / tickSize) * 5 * this.PIXELS_PER_FOOT, 0)
            ctx.lineTo(i * (ticks / tickSize) * 5 * this.PIXELS_PER_FOOT, 10 * this.scale)
            ctx.fillText(i * 5 * (ticks / tickSize) + 'ft', i * (ticks / tickSize) * 5 * this.PIXELS_PER_FOOT, 25 * this.scale)
            ctx.fillText(i * tickSize + 'm', i * (ticks / tickSize) * 5 * this.PIXELS_PER_FOOT, 45 * this.scale)
        })
        ctx.stroke()
        ctx.restore()
    }

    private drawCharacter(ctx: CanvasRenderingContext2D, character: Character) {

        //don't draw dead characters
        if (character.hp <= -10)
            return

        const drawHealth = () => {
            ctx.beginPath()
            ctx.lineWidth = 3
            if (character.hp > 0) {
                ctx.strokeStyle = "#008000"
                ctx.arc(0, 0, character.size * this.PIXELS_PER_FOOT / 2,
                    (-character.hp / character.maxHp) * Math.PI - Math.PI / 2,
                    (character.hp / character.maxHp) * Math.PI - Math.PI / 2)
            }
            else {
                ctx.strokeStyle = "#D22B2B"
                ctx.arc(0, 0, character.size * this.PIXELS_PER_FOOT / 2,
                    ((character.hp + 10) / -10) * Math.PI - Math.PI / 2,
                    ((-character.hp + 10) / -10) * Math.PI - Math.PI / 2)
            }

            ctx.stroke()
        }

        ctx.save();
        ctx.translate(character.x * this.PIXELS_PER_FOOT, character.y * this.PIXELS_PER_FOOT)
        ctx.rotate(character.direction)

        ctx.fillStyle = this.selectedCharacters.some((selectedCharacter) => {
            return selectedCharacter.id == character.id
        }) ? '#009900' : '#000000'

        ctx.beginPath()
        ctx.arc(0, 0, character.size * this.PIXELS_PER_FOOT / 2, 0, 2 * Math.PI)
        ctx.fill()

        //draw an arrow
        ctx.beginPath()
        ctx.strokeStyle = '#FFFFFF'

        ctx.moveTo(0, -(character.size) + 1)
        ctx.lineTo(0, (character.size) - 1)

        ctx.stroke()
        drawHealth()

        ctx.restore();
    }

    createCharacter() {
        this.socket?.emit(CONSTANTS.CREATE_CHARACTER)
    }

    createCommunity(options: { size: string, race: string }) {
        // get client center
        const origin = this.getViewPortOrigin()
        // console.log(origin)
        // console.log({ ...options, location: origin })
        this.socket?.emit(CONSTANTS.CREATE_COMMUNITY, { ...options, location: origin })
    }

    clickHandler(e: MouseEvent) {
        //  const tzn = this.gameEngine.gameWorld.getTacticalZoneName(this.getMousePosition(e))
        // console.log(tzn)
        //const mp = this.getMousePosition(e)
        //console.log('mouse position', mp)
        // const zivp = this.getZonesInViewPort()
        // console.log(zivp)
        //const vp = this.getViewPort()
        //console.log('viewport', vp)
        //  const c = this.gameEngine.gameWorld.getCharactersWithin(rect)
        //  console.log(c.length)
        //  const d = this.gameEngine.gameWorld.getAllCharacters()
        //  console.log(Array.from(d.values()).length) 

        const characters = this.gameEngine.gameWorld.getCharactersAt(this.getMousePosition(e))
        //TODO just the first character
        this.selectedCharacters = characters
        //tell the ui about the selected characters
        this.emit(CONSTANTS.CLIENT_SELECTED_CHARACTERS, this.getSelectedCharacters())
    }

    private getZonesInViewPort() {
        return this.gameEngine.getZonesIn(this.getViewPort())
    }

    castSpell(casterId: string, spellName: string, targets: string[]) {
        //todo maybe don't tell the local gameengine because the damage will end up being wrong?
        //  console.log('spellName', spellName)
        // console.log('casterId', casterId)
        // console.log('targets', targets)
        this.gameEngine.castSpell(casterId, spellName, targets)
        this.socket?.emit(CONSTANTS.CAST_SPELL, { casterId: casterId, spellName: spellName, targets: targets })
    }

    private getViewPortOrigin() {
        const rect = this.getCanvas().getBoundingClientRect()
        const middleX = (rect.right - rect.left) / this.PIXELS_PER_FOOT * this.scale / 2 + this.translateX
        const middleY = (rect.bottom - rect.top) / this.PIXELS_PER_FOOT * this.scale / 2 + this.translateY
        return { x: middleX, y: middleY }
    }

    private getMousePosition(e: MouseEvent) {
        const rect = this.getCanvas().getBoundingClientRect()
        const y = (e.clientY - rect.top + (this.translateY * this.PIXELS_PER_FOOT / this.scale)) / this.PIXELS_PER_FOOT * this.scale
        const x = (e.clientX - rect.left + (this.translateX * this.PIXELS_PER_FOOT / this.scale)) / this.PIXELS_PER_FOOT * this.scale

        //  console.log('y', y)
        return { x, y }
    }

    keyDownHandler(e: KeyboardEvent) {
        const code = e.code

        if (code == 'KeyD') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.TURN_RIGHT, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.TURN_RIGHT, this.getSelectedCharacters())
            }
        }
        else if (code == 'KeyA') {
            if (this.selectedCharacters) {
                //this.emit(CONSTANTS.TURN_LEFT, this.getSelectedCharacters())
                this.gameEngine.turnLeft(this.selectedCharacters)
                this.socket?.emit(CONSTANTS.TURN_LEFT, this.getSelectedCharacters())
            }
        }
        else if (code == 'KeyS') {
            if (this.selectedCharacters) {
                //if holding shift then double fast goer
                this.emit(CONSTANTS.DECELERATE, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.DECELERATE, this.getSelectedCharacters())
            }
        }
        else if (code == 'KeyW') {
            if (this.selectedCharacters) {
                //if holding shift then double fast goer
                this.emit(CONSTANTS.ACCELERATE, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.ACCELERATE, this.getSelectedCharacters())
            }
        }
        else if (code == "ShiftLeft") {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.ACCELERATE_DOUBLE, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.ACCELERATE_DOUBLE, this.getSelectedCharacters())
            }
        }
    }

    keyUpHandler(e: KeyboardEvent) {
        const code = e.code
        //console.log(e)

        if (code == 'KeyD') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.TURN_STOP, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.TURN_STOP, this.getSelectedCharacters())
            }
        }
        else if (code == 'KeyA') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.TURN_STOP, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.TURN_STOP, this.getSelectedCharacters())
            }
        }
        else if (code == 'KeyS') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.STOP_ACCELERATE, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.STOP_ACCELERATE, this.getSelectedCharacters())
            }
        }
        else if (code == 'KeyW') {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.STOP_ACCELERATE, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.STOP_ACCELERATE, this.getSelectedCharacters())

            }
        }
        else if (code == "ShiftLeft") {
            if (this.selectedCharacters) {
                this.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, this.getSelectedCharacters())
                this.socket?.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, this.getSelectedCharacters())
            }
        }
    }

    private getSelectedCharacters() {
        const ids: string[] = this.selectedCharacters.map((c) => { return c.id })
        return this.gameEngine.gameWorld.getCharacters(ids)
    }

    private stop() {
        this.stopped = true;
    }

    disconnect() {
        this.socket?.disconnect()
        return true;
    }

    async connect() {
        //console.log('Client Engine connect')

        try {
            this.socket = io({
                path: "/api/world/"
            })
            this.socket.on(CONSTANTS.CONNECT, () => {
                //console.log('CONSTANTS.CONNECT')
                this.connected = true
                //tell the ui we connected
                this.emit(CONSTANTS.CONNECT)
                //ask the server for characters
                //console.log(this.socket)
                this.socket?.emit(CONSTANTS.CLIENT_CHARACTER_UPDATE, this.getViewPort())
            })

            //disconnect handler
            this.socket?.on(CONSTANTS.DISCONNECT, (reason: any) => {
                console.log('DISCONNECT', reason)
                this.connected = false
                this.emit(CONSTANTS.DISCONNECT)
            })

            //pc disconnect
            this.socket?.on(CONSTANTS.PC_DISCONNECT, (playerId: string) => {
                console.log('PC_DISCONNECT', playerId)
                //dispatch(removePlayer(playerId))
                this.disconnect()
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
                // console.log('CONSTANTS.CLIENT_CHARACTER_UPDATE', characters)
                //tell the gameengine we got an update 
                // console.log(characters)
                this.gameEngine.updateCharacters(characters)
                const merged = this.selectedCharacters.map((selected) => {
                    //looping over all selected charecters
                    //look for each selected character in the list of characters
                    const u = characters.find((c) => { return c.id == selected.id; });
                    //if we didn't find it in the list of updated characters, then just use the current value
                    return { ...selected, ...u };
                });
                //tell the ui about the updates to the selected characters
                //  console.log(merged)
                this.emit(CONSTANTS.CLIENT_SELECTED_CHARACTERS, merged)
            })
        }
        catch (e) {
            //something went wrongc
            console.log(e)
            return false
        }

        return true
    }

    private getViewPort(): { left: number, right: number, top: number, bottom: number } {
        const clientRect = this.getCanvas().getBoundingClientRect()

        const left = (clientRect.left - clientRect.left) / this.PIXELS_PER_FOOT * this.scale + this.translateX
        const right = (clientRect.right - clientRect.left) / this.PIXELS_PER_FOOT * this.scale + this.translateX
        const top = (clientRect.top - clientRect.top) / this.PIXELS_PER_FOOT * this.scale + this.translateY
        const bottom = (clientRect.bottom - clientRect.top) / this.PIXELS_PER_FOOT * this.scale + this.translateY

        const rect = { left: left, right: right, top: top, bottom: bottom };
        //console.log(rect)
        return rect
    }
}