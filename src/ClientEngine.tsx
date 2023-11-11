"use client"
import EventEmitter from "events";
import { Socket, io } from "socket.io-client";
import GameEngine from "@/GameEngine";
import Character from "./Character";
import * as CONSTANTS from "@/CONSTANTS";
import Player from "./Player";


export default class ClientEngine {

    //event things
    private socket: Socket | undefined
    private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    private emit: (eventName: string | symbol, ...args: any[]) => boolean

    //state things
    private stopped: boolean = false //control the draw loop
    private connected: boolean = false
    private controlledCharacter: Character | undefined
    /**
     * @deprecated The method should not be used
     */
    private selectedCharacter: Character | undefined
    private claimedCharacters: Character[] = []
    private gameEngine: GameEngine
    private player: Player | undefined

    //react/dom things
    private getCanvas: (() => HTMLCanvasElement)

    //drawing things
    private PIXELS_PER_FOOT = 20
    private scale: number = 1
    private translateX = -20 * this.scale
    private translateY = -20 * this.scale
    private mousePosition: { x: number, y: number, } = { x: 0, y: 0 }

    constructor(eventEmitter: EventEmitter, getCanvas: (() => HTMLCanvasElement)) {
        //console.log('ClientEngine.constructor')
        this.getCanvas = getCanvas
        this.gameEngine = new GameEngine({ ticksPerSecond: 30, doGameLogic: false }, eventEmitter)
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

    stop() {
        this.stopped = true;
        this.gameEngine.stop()
    }

    getCharacter(characterId: string) {
        return this.gameEngine.getCharacter(characterId)
    }

    claim(characterId: string) {
        //  client claim
        console.log('claim')
        this.socket?.emit(CONSTANTS.CLAIM_CHARACTER, characterId)
    }

    control(characterId: string) {
        this.controlledCharacter = this.gameEngine.gameWorld.getCharacter(characterId)
        //tell the ui
        this.emit(CONSTANTS.CONTROL_CHARACTER, this.controlledCharacter)
        //tell the server
        this.socket?.emit(CONSTANTS.CONTROL_CHARACTER, characterId)
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

        ctx.fillStyle = "#d7f0dd";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        //if (character.hp <= -10)
        //    return


        const drawControlled = () => {
            const now = (new Date()).getTime()
            const a = (3 + Math.sin(now / 200)) / 4

            ctx.save()
            ctx.rotate(-character.direction)

            ctx.beginPath()
            ctx.setLineDash([20, 8]);

            ctx.strokeStyle = "rgba(255, 215, 0, " + a + ")"
            ctx.lineWidth = 6
            ctx.arc(0, 0, character.size * this.PIXELS_PER_FOOT / 2 + 3, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.restore()
        }

        const drawTargeted = () => {
            const now = (new Date()).getTime()
            const a = (3 + Math.sin((now + 3) / 200)) / 4

            ctx.save()
            ctx.rotate(-character.direction + .2)

            ctx.beginPath()
            ctx.setLineDash([20, 8]);

            ctx.strokeStyle = "#bb2930"
            ctx.strokeStyle = "rgba(187, 41, 48, " + a + ")"
            ctx.lineWidth = 6
            ctx.arc(0, 0, character.size * this.PIXELS_PER_FOOT / 2 + 3, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.restore()
        }


        const drawHealth = () => {
            ctx.beginPath()

            ctx.strokeStyle = "#e0e0e0"

            ctx.lineWidth = 3
            if (character.hp > 0) {
                //ctx.strokeStyle = "#008000"
                ctx.arc(0, 0, character.size * this.PIXELS_PER_FOOT / 2 - 3,
                    (-character.hp / character.maxHp) * Math.PI - Math.PI / 2,
                    (character.hp / character.maxHp) * Math.PI - Math.PI / 2)
            }
            else {
                ctx.strokeStyle = "#D22B2B"
                ctx.arc(0, 0, character.size * this.PIXELS_PER_FOOT / 2 - 3,
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

        // const selected = this.selectedCharacter?.id == character.id;

        const controlled = this.controlledCharacter?.id == character.id
        const targeted = this.controlledCharacter?.target == character.id


        ctx.fillStyle = "#f0f0f0"


        if (targeted) {
            //TODO draw a special circle around it
            drawTargeted()
        }
        if (controlled) {
            //  draw a special circle around it
          //  console.log('controlled')
            drawControlled()
        }

        if (claimed) {
            //TODO draw a star or something
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
        // console.log('click')
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
        //  just the first character
        this.selectedCharacter = characters[0]
        //tell the ui about the selected character
        this.emit(CONSTANTS.SELECTED_CHARACTER, this.selectedCharacter)
    }

    doubleClickHandler(e: MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        //  console.log('doubleclick')
        const characters = this.gameEngine.gameWorld.getCharactersAt(this.getMousePosition(e))

        //if logged in 
        if (this.player) {
            //  console.log('this.claimedCharacters', this.claimedCharacters)
            //  console.log('characters', characters)
            //if no claimed character
            if (this.claimedCharacters.length == 0 && characters) {
                //then claim
                this.claim(characters[0].id)
                this.control(characters[0].id)
            }
            else if (this.controlledCharacter && characters.length > 0) {
                //attack it
                this.attack(this.controlledCharacter.id, characters[0].id)
            }
            else if (this.controlledCharacter && characters.length == 0) {
                //  console.log('clearing attackee')
                this.attack(this.controlledCharacter.id, '')
            }
        }
    }

    attack(attackerId: string, attackeeId: string) {
        this.gameEngine.attack(attackerId, attackeeId)
        //tell the server
        this.socket?.emit(CONSTANTS.ATTACK, attackerId, attackeeId)
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

    getMousePosition(e: MouseEvent) {
        const rect = this.getCanvas().getBoundingClientRect()
        const y = (e.clientY - rect.top + (this.translateY * this.PIXELS_PER_FOOT / this.scale)) / this.PIXELS_PER_FOOT * this.scale
        const x = (e.clientX - rect.left + (this.translateX * this.PIXELS_PER_FOOT / this.scale)) / this.PIXELS_PER_FOOT * this.scale

        //  console.log('y', y)
        return { x, y }
    }

    getScreenPosition(p: { x: number, y: number }) {
        const rect = this.getCanvas().getBoundingClientRect()
        const y = p.y * this.PIXELS_PER_FOOT / this.scale - (this.translateY * this.PIXELS_PER_FOOT / this.scale) + rect.top
        const x = p.x * this.PIXELS_PER_FOOT / this.scale - (this.translateX * this.PIXELS_PER_FOOT / this.scale) + rect.left
        return { x: x, y: y }
    }

    getCharacterAt(position: { x: number; y: number; }) {
        return this.gameEngine.gameWorld.getCharacterAt(position)
    }

    keyDownHandler(e: KeyboardEvent) {
        const code = e.code


       // console.log(this.controlledCharacter)
        if (this.controlledCharacter) {
            if (code == 'KeyD') {
                this.turnRight(this.controlledCharacter)
            }
            else if (code == 'KeyA') {
                this.turnLeft(this.controlledCharacter)
            }
            else if (code == 'KeyS') {
                this.decelarate(this.controlledCharacter)
            }
            else if (code == 'KeyW') {
                // console.log('W')
                this.accelerate(this.controlledCharacter)
            }
            else if (code == "ShiftLeft") {
                this.accelerateDouble(this.controlledCharacter)
            }
        }
    }

    private accelerateDouble(character: Character) {
        if (character) {
            const c = this.gameEngine.accelerateDouble(character, this.player?.id);
            if (c) {
                this.socket?.emit(CONSTANTS.ACCELERATE_DOUBLE, c);
            }
        }
    }

    private accelerate(character: Character) {
        if (character) {
            const c = this.gameEngine.accelerate(character, this.player?.id);
            if (c) {
                this.socket?.emit(CONSTANTS.ACCELERATE, c);
            }
        }
    }

    private decelarate(character: Character) {
        if (character) {
            const c = this.gameEngine.decelerate(character, this.player?.id);
            if (c) {
                this.socket?.emit(CONSTANTS.DECELERATE, c);
            }
        }
    }

    private turnLeft(character: Character) {
        if (character) {
            const c = this.gameEngine.turnLeft(character, this.player?.id);
            if (c) {
                this.socket?.emit(CONSTANTS.TURN_LEFT, c);
            }
        }
    }

    private turnRight(character: Character) {
        if (character) {
            const c = this.gameEngine.turnRight(character, this.player?.id)
            if (c) {
                this.socket?.emit(CONSTANTS.TURN_RIGHT, c)
            }
        }
    }

    keyUpHandler(e: KeyboardEvent) {
        if (this.controlledCharacter) {
            if (e.code == 'KeyD') {
                this.turnStop(this.controlledCharacter)
            }
            else if (e.code == 'KeyA') {
                this.turnStop(this.controlledCharacter)
            }
            else if (e.code == 'KeyS') {
                this.accelerateStop(this.controlledCharacter)
            }
            else if (e.code == 'KeyW') {
                this.accelerateStop(this.controlledCharacter)
            }
            else if (e.code == "ShiftLeft") {
                this.accelerateDoubleStop(this.controlledCharacter)
            }
        }
    }

    private accelerateDoubleStop(character: Character) {
        if (character) {
            const c = this.gameEngine.accelerateDoubleStop(character, this.player?.id);
            if (c) {
                this.socket?.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, c);
            }
        }
    }

    private accelerateStop(character: Character) {
        if (character) {
            const c = this.gameEngine.accelerateStop(character, this.player?.id);
            if (c) {
                this.socket?.emit(CONSTANTS.STOP_ACCELERATE, c);
            }
        }
    }

    private turnStop(character: Character) {
        if (character) {
            const c = this.gameEngine.turnStop(character, this.player?.id);
            if (c) {
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

            this.socket?.on(CONSTANTS.CURRENT_PLAYER, (player: Player) => {
                this.player = player
            })

            this.socket?.on(CONSTANTS.CLAIMED_CHARACTERS, (c: Character[]) => {
                this.claimedCharacters = c
                this.emit(CONSTANTS.CLAIMED_CHARACTERS, c)
            })

            this.socket?.on(CONSTANTS.CONTROL_CHARACTER, (c: Character) => {
              //  console.log(c)
                this.gameEngine.updateCharacter(c)
                this.controlledCharacter = c
                this.emit(CONSTANTS.CONTROL_CHARACTER, c)
                const t = this.getCharacter(c.target)
                this.emit(CONSTANTS.TARGET_CHARACTER, t)
            })

            //disconnect handler
            this.socket?.on(CONSTANTS.DISCONNECT, (reason: any) => {
                this.onDisconnect(reason)
            })

            //pc location data
            this.socket?.on(CONSTANTS.CLIENT_CHARACTER_UPDATE, (characters: Character[]) => {
                //tell the gameengine we got an update 
                this.gameEngine.updateCharacters(characters)

                //updates for the client ui
                if (this.selectedCharacter) {
                    //look for a new version of the selected character
                    const u = characters.find((c) => { return c.id == this.selectedCharacter?.id })

                    //tell the ui about the updates to the selected character
                    this.emit(CONSTANTS.SELECTED_CHARACTER, u)
                }

                if (this.controlledCharacter) {
                   // console.log(this.controlledCharacter)
                    //look for a new version of the controlled character
                    const u = characters.find((c) => { return c.id == this.controlledCharacter?.id })
                    if (u) {
                        this.controlledCharacter = u
                        //tell the ui about the updates to the selected character
                        this.emit(CONSTANTS.CONTROL_CHARACTER, u)
                    }
                }

                //tell the ui about any updates to this player's claimed characters
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
        console.log(characters)
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