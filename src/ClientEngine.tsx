"use client"
import EventEmitter from "events";
import { Socket, io } from "socket.io-client";
import GameEngine from "@/GameEngine";
import Character from "./Character";
import * as CONSTANTS from "@/CONSTANTS";

export default class ClientEngine {

    //event things
    private socket: Socket | undefined
    private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    private emit: (eventName: string | symbol, ...args: any[]) => boolean

    //state things
    stopped: boolean = false //control the draw loop
    private connected: boolean = false
    private controlledCharacter: Character | undefined
    private selectedCharacters: Character[] = []
    private claimedCharacters: Character[] = []
    private gameEngine: GameEngine

    //react/dom things
    private getCanvas: (() => HTMLCanvasElement)

    //drawing things
    private PIXELS_PER_FOOT = 20
    private scale: number = 1
    private translateX = -20 * this.scale
    private translateY = -20 * this.scale

    constructor(eventEmitter: EventEmitter, getCanvas: (() => HTMLCanvasElement)) {
        //console.log('ClientEngine.constructor')
        this.getCanvas = getCanvas
        this.gameEngine = new GameEngine({ ticksPerSecond: 30 }, eventEmitter)
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)


        const observer = new ResizeObserver(() => {
            const canvas = getCanvas()
            canvas.width = canvas.clientWidth
            canvas.height = canvas.clientHeight
        })
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

    getCharacter(characterId: string) {
        return this.gameEngine.getCharacter(characterId)
    }

    claim(characterId: string) {
        //  client claim
        this.socket?.emit(CONSTANTS.CLAIM_CHARACTER, characterId)
    }

    control(characterId: string) {
        //don't think the server cares
        //this.socket?.emit(CONSTANTS.CONTROL_CHARACTER, characterId)
        this.controlledCharacter = this.gameEngine.gameWorld.getCharacter(characterId)
        //tell the ui
        this.emit(CONSTANTS.CONTROL_CHARACTER, this.controlledCharacter)
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

        const newScale = Math.min(Math.max(1, this.scale + zoom), 100000)
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
                this.drawCharacter(ctx, character)
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
        ctx.save()
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1 * this.scale
        //vertical line
        ctx.moveTo(
            center * this.PIXELS_PER_FOOT / this.scale,
            (-length / 2 + center) * this.PIXELS_PER_FOOT / this.scale)
        ctx.lineTo(
            center * this.PIXELS_PER_FOOT / this.scale,
            (length / 2 + center) * this.PIXELS_PER_FOOT / this.scale)

        //horizontal line
        ctx.moveTo(
            (-length / 2 + center) * this.PIXELS_PER_FOOT / this.scale,
            center * this.PIXELS_PER_FOOT)
        ctx.lineTo(
            (length / 2 + center) * this.PIXELS_PER_FOOT / this.scale,
            center * this.PIXELS_PER_FOOT / this.scale)
        ctx.stroke()
        ctx.restore()
    }

    private scaleStyle(ctx: CanvasRenderingContext2D) {
        ctx.font = 18 * this.scale + "px Arial"
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1 * this.scale
    }

    private drawTurnScale(ctx: CanvasRenderingContext2D) {
        const xOffset = 10
        const yOffset = 10
        const ticks = 6
        const tickSize = 5
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.translate(xOffset, yOffset)
        ctx.scale(1 / this.scale, 1 / this.scale)
        this.scaleStyle(ctx)
        ctx.beginPath()
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
        ctx.scale(1 / this.scale, 1 / this.scale)
        this.scaleStyle(ctx)
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
        ctx.scale(1 / this.scale, 1 / this.scale)
        this.scaleStyle(ctx)

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

            if (selected && claimed) {
                //purple
                ctx.strokeStyle = "#f94de4"
            }
            else if (selected) {
                //green
                ctx.strokeStyle = "#3b9f46"
            }
            else if (claimed) {
                //blue
                ctx.strokeStyle = "#0e59d0"
            }
            else {
                //grey
                ctx.strokeStyle = "#cacaca"
            }

            ctx.lineWidth = 3
            if (character.hp > 0) {
                //ctx.strokeStyle = "#008000"
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

        ctx.save()
        ctx.translate(character.x * this.PIXELS_PER_FOOT, character.y * this.PIXELS_PER_FOOT)
        ctx.rotate(character.direction)

        const claimed = this.claimedCharacters.some((claimedCharacter) => {
            return claimedCharacter.id == character.id;
        })

        const selected = this.selectedCharacters.some((selectedCharacter) => {
            return selectedCharacter.id == character.id;
        })


        if (selected && claimed) {
            //purple
            ctx.fillStyle = '#fb86ed'
            ctx.strokeStyle = "#f94de4"
        }
        else if (selected) {
            //green
            ctx.fillStyle = '#4fbd5b'
            ctx.strokeStyle = "#3b9f46"
        }
        else if (claimed) {
            //blue
            ctx.fillStyle = '#2070f0'
            ctx.strokeStyle = "#0e59d0"
        }
        else {
            //grey
            ctx.fillStyle = "#F0F0F0"
            ctx.strokeStyle = "#cacaca"
        }

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

        ctx.restore()
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
        this.emit(CONSTANTS.SELECTED_CHARACTERS, this.selectedCharacters)
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
            this.turnRight(this.selectedCharacters)
        }
        else if (code == 'KeyA') {
            this.turnLeft(this.selectedCharacters)
        }
        else if (code == 'KeyS') {
            this.decelarate(this.selectedCharacters)
        }
        else if (code == 'KeyW') {
            this.accelerate(this.selectedCharacters)
        }
        else if (code == "ShiftLeft") {
            this.accelerateDouble(this.selectedCharacters)
        }
    }

    private accelerateDouble(characters: Character[]) {
        if (characters) {
            const c = this.gameEngine.accelerateDouble(characters);
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.ACCELERATE_DOUBLE, c);
            }
        }
    }

    private accelerate(characters: Character[]) {
        if (characters) {
            const c = this.gameEngine.accelerate(characters);
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.ACCELERATE, c);
            }
        }
    }

    private decelarate(characters: Character[]) {
        if (characters) {
            const c = this.gameEngine.decelerate(characters);
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.DECELERATE, c);
            }
        }
    }

    private turnLeft(characters: Character[]) {
        if (characters) {
            const c = this.gameEngine.turnLeft(characters);
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.TURN_LEFT, c);
            }
        }
    }

    private turnRight(characters: Character[]) {
        if (characters) {
            const c = this.gameEngine.turnRight(characters)
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.TURN_RIGHT, c)
            }
        }
    }

    keyUpHandler(e: KeyboardEvent) {

        if (e.code == 'KeyD') {
            this.turnStop(this.selectedCharacters)
        }
        else if (e.code == 'KeyA') {
            this.turnStop(this.selectedCharacters)
        }
        else if (e.code == 'KeyS') {
            this.accelerateStop(this.selectedCharacters)
        }
        else if (e.code == 'KeyW') {
            this.accelerateStop(this.selectedCharacters)
        }
        else if (e.code == "ShiftLeft") {
            this.accelerateDoubleStop(this.selectedCharacters)
        }
    }

    private accelerateDoubleStop(characters: Character[]) {
        if (characters) {
            const c = this.gameEngine.accelerateDoubleStop(characters);
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, c);
            }
        }
    }

    private accelerateStop(characters: Character[]) {

       

        if (characters) {
            const c = this.gameEngine.accelerateStop(characters);
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.STOP_ACCELERATE, c);
            }
        }
    }

    private turnStop(characters: Character[]) {

        if (characters) {
            const c = this.gameEngine.turnStop(characters);
            if (c.length > 0) {
                this.socket?.emit(CONSTANTS.TURN_STOP, c);
            }

        }
    }

    disconnect() {
        this.socket?.disconnect()
        return true
    }

    connect() {
        //console.log('Client Engine connect')

        try {
            this.socket = io({
                path: "/api/world/"
            })
            this.socket.on(CONSTANTS.CONNECT, () => {
                //console.log('CONSTANTS.CONNECT')
                this.onConnect()
            })

            this.socket?.on(CONSTANTS.SERVER_INITIAL, (characters: Character[]) => {
                this.onServerInitial(characters)
            })

            this.socket?.on(CONSTANTS.CLAIMED_CHARACTERS, (c: Character[]) => {
                this.claimedCharacters = c
                this.emit(CONSTANTS.CLAIMED_CHARACTERS, c)
            })

            this.socket?.on(CONSTANTS.SELECTED_CHARACTERS, (selectedCharacters: Character[]) => {
                this.selectedCharacters = selectedCharacters
                this.emit(CONSTANTS.SELECTED_CHARACTERS, selectedCharacters)

            })

            //disconnect handler
            this.socket?.on(CONSTANTS.DISCONNECT, (reason: any) => {
                this.onDisconnect(reason)
            })

            //pc location data
            this.socket?.on(CONSTANTS.CLIENT_CHARACTER_UPDATE, (characters: Character[]) => {
                //tell the gameengine we got an update 
                this.gameEngine.updateCharacters(characters)

                //tell the ui about any updates to this player's selected characters
                const mergedSelected = this.selectedCharacters.map((selected) => {
                    //look for each selected character in the list of characters
                    const u = characters.find((c) => { return c.id == selected.id })
                    //if we didn't find it in the list of updated characters, then just use the current value
                    return { ...selected, ...u }
                })
                //tell the ui about the updates to the selected characters
                this.emit(CONSTANTS.SELECTED_CHARACTERS, mergedSelected)

                //tell the ui about any updates to this player's selected characters
                const mergedClaimed = this.claimedCharacters.map((claimed) => {
                    //look for each selected character in the list of characters
                    const u = characters.find((c) => { return c.id == claimed.id })
                    //if we didn't find it in the list of updated characters, then just use the current value
                    return { ...claimed, ...u }
                })
                //tell the ui about the updates to the selected characters
                this.emit(CONSTANTS.CLAIMED_CHARACTERS, mergedClaimed)
            })
        }
        catch (e) {
            //something went wrongc
            console.log(e)
            return false
        }

        return true
    }

    private onDisconnect(reason: any) {
        console.log('DISCONNECT', reason)
        this.connected = false
        this.emit(CONSTANTS.DISCONNECT)
    }

    private onServerInitial(characters: Character[]) {
        this.gameEngine.updateCharacters(characters)
    }

    private onConnect() {
        this.connected = true
        //tell the ui we connected
        this.emit(CONSTANTS.CONNECT)
        //ask the server for characters
        this.socket?.emit(CONSTANTS.CLIENT_INITIAL, this.getViewPort() as CONSTANTS.CLIENT_INITIAL_INTERFACE)
    }

    private getViewPort() {
        const clientRect = this.getCanvas().getBoundingClientRect()
        const left = (clientRect.left - clientRect.left) / this.PIXELS_PER_FOOT * this.scale + this.translateX
        const right = (clientRect.right - clientRect.left) / this.PIXELS_PER_FOOT * this.scale + this.translateX
        const top = (clientRect.top - clientRect.top) / this.PIXELS_PER_FOOT * this.scale + this.translateY
        const bottom = (clientRect.bottom - clientRect.top) / this.PIXELS_PER_FOOT * this.scale + this.translateY

        const rect = { left: left, right: right, top: top, bottom: bottom }
        //console.log(rect)
        return rect
    }
}