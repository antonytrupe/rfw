"use client"
import EventEmitter from "events"
import { Socket, io } from "socket.io-client"
import GameEngine from "@/GameEngine"
import Character from "./types/Character"
import * as CONSTANTS from "@/types/CONSTANTS"
import Player from "./types/Player"
import GameEvent from "./types/GameEvent"
import Point from "./types/Point"
import { ViewPort } from "@/types/CONSTANTS"
import WorldObject from "./types/WorldObject"
import { SHAPE } from "./types/SHAPE"
import { COMMUNITY_SIZE } from "./types/CommunitySize"
import { distanceBetweenPoints, getNextPointOnCircle, getNextPointOnLine } from "./Geometry"
import { clamp } from "./utility"
var seedrandom = require('seedrandom')

export default class ClientEngine {

    //event things
    private socket: Socket | undefined
    //private emit: (eventName: string | symbol, ...args: any[]) => boolean

    //state things
    private stopped: boolean = false //control the draw loop
    connected: boolean = false
    private gameEngine: GameEngine
    private player: Player | undefined

    //react/dom things
    private getCanvas: (() => HTMLCanvasElement)
    updateChat: { (message: string): void }

    //drawing things
    private PIXELS_PER_FOOT = 20
    private scale: number = 1
    private translateX = -20 * this.scale
    private translateY = -20 * this.scale
    private mousePosition: Point = { x: 0, y: 0 }
    game_events: GameEvent[] = []
    templates: Map<string, WorldObject> = new Map()

    constructor(getCanvas: (() => HTMLCanvasElement), updateChat: { (message: string): void }) {
        //console.log('ClientEngine.constructor')
        this.updateChat = updateChat
        this.getCanvas = getCanvas
        let eventEmitter: EventEmitter = new EventEmitter()
        this.gameEngine = new GameEngine({ ticksPerSecond: 30, doGameLogic: false }, eventEmitter)
        //this.emit = eventEmitter.emit.bind(eventEmitter)

        const observer = new ResizeObserver(() => {
            const canvas = getCanvas()
            canvas.width = canvas.clientWidth
            canvas.height = canvas.clientHeight
        })
        observer.observe(getCanvas())

        this.start()
    }

    start() {
        this.gameEngine.start()

        let renderLoop = () => {
            if (this.stopped) {
                return
            }
            this.draw()
            window.requestAnimationFrame(renderLoop.bind(this))
        }

        window.requestAnimationFrame(renderLoop.bind(this))
    }

    chat(message: string) {
        if (message[0] == '/') {

            const parts = message.split(' ')
            //console.log('parts', parts)
            //if any of the parts are the word "here", then replace it with the center of the viewport

            //console.log(parts[0].substring(1))
            //console.log(parts[1].toLocaleUpperCase())

            switch (parts[0].substring(1).toLowerCase()) {
                case "spawn":
                    switch (parts[1].toUpperCase()) {
                        case COMMUNITY_SIZE.THORP:
                        case COMMUNITY_SIZE.HAMLET:
                        case COMMUNITY_SIZE.VILLAGE:
                        case COMMUNITY_SIZE.SMALL_TOWN:
                        case COMMUNITY_SIZE.LARGE_TOWN:
                        case COMMUNITY_SIZE.SMALL_CITY:
                        case COMMUNITY_SIZE.LARGE_CITY:
                        case COMMUNITY_SIZE.METROPOLIS:
                            this.createCommunity({ size: parts[1], race: parts[2] })
                            break
                    }
                    break
                default:
                    this.socket?.emit(CONSTANTS.CHAT, {
                        target: this.player?.controlledCharacter,
                        message: message,
                        type: 'command',
                        time: new Date().getTime()
                    })
                    break
            }
        }
        else {
            if (!!this.player?.controlledCharacter) {
                this.game_events.push({
                    target: this.player?.controlledCharacter,
                    message: message,
                    type: 'say',
                    time: new Date().getTime()
                })
                //console.log('sending chat event to the server')
                this.socket?.emit(CONSTANTS.CHAT, {
                    target: this.player?.controlledCharacter,
                    message: message,
                    type: 'say',
                    time: new Date().getTime()
                })
            }
        }
    }

    stop() {
        this.stopped = true
        this.gameEngine.stop()
    }

    getCharacter(characterId: string) {
        return this.gameEngine.getCharacter(characterId)
    }

    claim(characterId: string) {
        //client claim
        //console.log('claim')
        if (this.player) {
            this.player.controlledCharacter = characterId
            this.socket?.emit(CONSTANTS.CLAIM_CHARACTER, characterId)
        }
    }

    unClaim(characterId: string) {
        //client claim
        //console.log('claim')
        if (this.player) {
            this.player.claimedCharacters.splice(this.player.claimedCharacters.findIndex(c => c == characterId), 1)
            this.player.controlledCharacter = ""
            this.socket?.emit(CONSTANTS.UNCLAIM_CHARACTER, characterId)
        }
    }

    control(characterId: string) {
        if (this.player) {
            this.player.controlledCharacter = characterId
            //tell the server
            this.socket?.emit(CONSTANTS.CONTROL_CHARACTER, characterId)
        }
    }

    focus(characterId: string) {
        const c = this.gameEngine.gameWorld.getCharacters([characterId])[0]
        //change the zoom
        this.scale = 1
        //change the  offsets
        //const center = this.getViewPortOrigin()
        //console.log('center', center)
        const rect = this.getViewPort()
        //console.log('rect', rect)
        this.translateX = c.location.x - (rect.right - rect.left) / 2
        this.translateY = c.location.y - (rect.bottom - rect.top) / 2
    }

    //TODO fix gross typing
    wheelHandler(e: { stopPropagation: () => void, deltaY: number, nativeEvent: Point }) {
        e.stopPropagation()
        //e.preventDefault()
        let zoom

        if (e.deltaY > 0) {
            zoom = this.scale / 10
        }
        else {
            zoom = - this.scale / 10
        }

        const mouse = this.getGamePosition(e.nativeEvent)

        let deltaX = (this.translateX - mouse.x) * zoom / this.scale
        let deltaY = (this.translateY - mouse.y) * zoom / this.scale

        const newScale = Math.min(Math.max(1, this.scale + zoom), 100000)
        if (newScale != this.scale) {
            this.scale = newScale
            const newX = this.translateX + deltaX
            const newY = this.translateY + deltaY
            this.setOffset({ x: newX, y: newY, scale: newScale })
        }
    }

    setOffset({ x, y, scale }: { x?: number, y?: number, scale?: number }) {
        if (!!x) {
            this.translateX = x
        }
        if (!!y) {
            this.translateY = y
        }
        if (!!scale) {
            this.scale = scale
        }
        //tell the server our viewport changed 
        this.socket?.emit(CONSTANTS.CLIENT_VIEWPORT, this.getViewPort())
    }

    private draw() {
        if (!this.getCanvas) { return }
        const canvas: HTMLCanvasElement | null = this.getCanvas()
        if (!canvas) { return }
        //@ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

        //Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        //keep the controlled character in frame
        //TODO do a smooth pan instead of a jerk
        const vp = this.getViewPort()
        if (this.player?.controlledCharacter) {
            //console.log(this.player?.controlledCharacter)
            const c = this.getCharacter(this.player?.controlledCharacter)
            if (c?.location) {

                if (c?.location.x > vp.right - c.radiusX * 2) {
                    //const delta=vp.right
                    const newLocal = c.location.x - (vp.right - vp.left) + c.radiusX * 2
                    //console.log(newLocal)
                    this.setOffset({ x: newLocal })
                }
                if (c?.location.x < vp.left + c.radiusX * 2) {
                    const newLocal = c.location.x - c.radiusX * 2
                    //console.log(newLocal)
                    this.setOffset({ x: newLocal })
                }

                if (c?.location.y > vp.bottom - c.radiusX * 2) {
                    //const delta=vp.right
                    const newLocal = c.location.y - (vp.bottom - vp.top) + c.radiusX * 2
                    //console.log(newLocal)
                    this.setOffset({ y: newLocal })
                }
                if (c?.location.y < vp.top + c.radiusX * 2) {
                    const newLocal = c.location.y - c.radiusX * 2
                    //console.log(newLocal)
                    this.setOffset({ y: newLocal })
                }
            }
        }

        //background color
        ctx.save()
        ctx.fillStyle = "#d7f0dd"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.restore()

        ctx.translate(-this.translateX * this.PIXELS_PER_FOOT / this.scale, -this.translateY * this.PIXELS_PER_FOOT / this.scale)
        ctx.scale(1 / this.scale, 1 / this.scale)

        this.drawCrossHair(ctx)

        //TODO not all, just the ones in view
        this.gameEngine.gameWorld.getAllWorldObjects()
            .forEach((wo: WorldObject) => {
                this.drawWorldObject(ctx, wo)
            })

        if (this.scale < 30) {

            //draw all the characters
            //only get the characters from the right zones, just in case we have more data then we need to draw
            this.gameEngine.gameWorld.getCharactersWithin(this.getViewPort())
                .forEach((character: Character) => {
                    if (character.hp > -10) {
                        this.drawCharacter(ctx, character)
                    }
                    else {
                        this.drawTombstone(ctx, character)
                    }
                })
        }

        //draw events
        this.drawEvents(ctx)

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

        //TODO draw stuff based on where the mouse is
        const c = this.getCharacterAt(this.mousePosition)
        //console.log(this.mousePosition)
        if (!!c) {
            this.drawCharacterPopup(ctx, c)
        }

        //poc
        this.pencilLine(ctx, { x: 30, y: 30 }, { x: 330, y: 30 }, 4)
        this.pencilLine(ctx, { x: 330, y: 30 }, { x: 330, y: 330 }, 4)
        this.pencilLine(ctx, { x: 330, y: 330 }, { x: 30, y: 330 }, 4)
        this.pencilLine(ctx, { x: 30, y: 330 }, { x: 30, y: 30 }, 4)


        this.pencilCircle(ctx, { x: 200, y: 200 }, 2.5 * this.PIXELS_PER_FOOT, 40)

    }

    pencilCircle(ctx: CanvasRenderingContext2D, origin: Point, radius: number, thickness: number) {
        const length = Math.PI * radius * 2

        ctx.save()

        ctx.globalCompositeOperation = "source-over"
        ctx.lineJoin = ctx.lineCap = "round"
        ctx.strokeStyle = "#0099ff"
        ctx.lineWidth = thickness
        let s = { x: origin.x, y: origin.y - radius }
        let e: Point
        var rng = seedrandom(s.x + s.y + radius)

        for (let i = 0; i < length;) {
            const r = (rng.quick() * thickness / 2)
            i += r
            ctx.globalAlpha = 0.6 * rng.quick()
            e = getNextPointOnCircle(origin, radius, s, r)
            ctx.beginPath()
            ctx.moveTo(s.x, s.y)
            ctx.lineTo(e.x, e.y)
            ctx.stroke()


            e = getNextPointOnCircle(origin, radius, e, 1)

            s = e
        }
        ctx.restore()
    }

    pencilLine(ctx: CanvasRenderingContext2D, start: Point, end: Point, thickness: number) {

        const length = distanceBetweenPoints(start, end)

        ctx.save()
        ctx.globalAlpha = 0.2
        ctx.globalCompositeOperation = "source-over"
        ctx.lineJoin = ctx.lineCap = "round"
        ctx.strokeStyle = "#0099ff"
        ctx.lineWidth = thickness
        let s = start
        let e
        var rng = seedrandom(start.x + start.y + end.x + end.y)

        for (let i = 0; i < length;) {
            const r = (rng.quick() * thickness / 3)
            i += r
            e = getNextPointOnLine(s, end, 1)
            ctx.beginPath()
            ctx.moveTo(s.x, s.y)
            ctx.lineTo(e.x, e.y)
            ctx.stroke()
            e = getNextPointOnLine(s, end, r)

            s = e
        }
        ctx.restore()
    }

    drawCharacterPopup(ctx: CanvasRenderingContext2D, character: Character) {
        ctx.save()
        //move center on character
        ctx.translate(character.location.x * this.PIXELS_PER_FOOT, character.location.y * this.PIXELS_PER_FOOT)

        const fontSize = 16 * this.scale
        ctx.font = fontSize + "px Futura Extra Bold"
        const info = []
        info.push('Level ' + character.level + ' ' + character.race.toLowerCase() + ' ' + character.characterClass.toLowerCase())
        info.push(character.hp + ' hitpoints')
        //info.push('mmmmmmmm.mmmmmmmm')

        const padding = 16 * this.scale
        const width = ctx.measureText(info[0]).width + (padding * 2)
        const height = fontSize * info.length + (padding * 2)
        //console.log('height', height)
        //console.log('width', width)

        //move up and to the lft
        ctx.translate(-width / 2, -character.radiusX * this.PIXELS_PER_FOOT - height)
        ctx.roundRect(0, 0, width, height, 10 * this.scale)

        // Create gradient
        const grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100)
        grd.addColorStop(0, "white")
        grd.addColorStop(1, "#faf0e6")

        // Fill with gradient
        ctx.fillStyle = grd
        ctx.textAlign = 'center'
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = 'black'
        //move to the right
        ctx.translate(width / 2, 0)

        ctx.fillText(info[0],
            0,
            padding * 2)

        ctx.fillText(info[1],
            0,
            padding * 2 + fontSize)

        ctx.restore()
    }

    private drawCrossHair(ctx: CanvasRenderingContext2D) {
        let center = 0
        let length = 20
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = '#000000'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1 * this.scale
        //vertical line
        ctx.moveTo(
            center * this.PIXELS_PER_FOOT,
            (-length / 2 + center) * this.PIXELS_PER_FOOT)
        ctx.lineTo(
            center * this.PIXELS_PER_FOOT,
            (length / 2 + center) * this.PIXELS_PER_FOOT)

        //horizontal line
        ctx.moveTo(
            (-length / 2 + center) * this.PIXELS_PER_FOOT,
            center * this.PIXELS_PER_FOOT)
        ctx.lineTo(
            (length / 2 + center) * this.PIXELS_PER_FOOT,
            center * this.PIXELS_PER_FOOT)
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

    private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillStyle: string, strokeStyle: string) {

        ctx.save()

        ctx.beginPath()
        var topCurveHeight = height * 0.3
        ctx.moveTo(x, y + topCurveHeight)
        //top left curve
        ctx.bezierCurveTo(
            x, y,
            x - width / 2, y,
            x - width / 2, y + topCurveHeight
        )

        //bottom left curve
        ctx.bezierCurveTo(
            x - width / 2, y + (height + topCurveHeight) / 2,
            x, y + (height + topCurveHeight) / 2,
            x, y + height
        )

        //bottom right curve
        ctx.bezierCurveTo(
            x, y + (height + topCurveHeight) / 2,
            x + width / 2, y + (height + topCurveHeight) / 2,
            x + width / 2, y + topCurveHeight
        )

        //top right curve
        ctx.bezierCurveTo(
            x + width / 2, y,
            x, y,
            x, y + topCurveHeight
        )

        ctx.closePath()
        ctx.fillStyle = fillStyle
        ctx.fill()

        ctx.lineWidth = 3
        ctx.strokeStyle = strokeStyle
        ctx.stroke()
        ctx.restore()
    }

    private drawEvents(ctx: CanvasRenderingContext2D) {
        //TODO somewhere handle multiple events for the same target not overlapping
        const now = (new Date()).getTime()
        this.game_events.forEach((event, i) => {

            //if its a recent event
            if (event.type == 'attack' && !!event.amount) {
                if (now - event.time < 2 * 1000) {
                    this.drawDamage(ctx, event)
                }
                else {
                    //drop off old events
                    this.game_events.splice(i, 1)
                }
            }
            if (event.type == 'miss') {
                if (now - event.time < 2 * 1000) {
                    this.drawDamage(ctx, event)
                }
                else {
                    //drop off old events
                    this.game_events.splice(i, 1)
                }
            }
            else if (event.type == 'say') {
                //TODO get this time in sync with the draw timer
                if (now - event.time < 6 * 1000) {
                    this.drawSay(ctx, event)
                }
                else {
                    //drop off old events
                    this.game_events.splice(i, 1)
                }
            }
        })
    }

    private drawSay(ctx: CanvasRenderingContext2D, event: GameEvent) {
        //console.log('drawSay')
        const character = this.getCharacter(event.target)
        if (character && !!event.message) {
            //TODO get this time in sync with the expiration time
            const duration = 6
            const distance = 120

            const now = (new Date()).getTime()
            const a = ((duration - 1) - (((now - event.time) / 1000) % duration)) / (duration - 1)

            ctx.save()
            ctx.translate(character.location.x * this.PIXELS_PER_FOOT, (character.location.y - character.radiusX) * this.PIXELS_PER_FOOT)

            ctx.font = 30 + "px Arial"
            ctx.fillStyle = `rgba(0,0,0,${a})`
            ctx.lineWidth = 2 * this.scale
            const textSize = ctx.measureText(event.message)
            ctx.translate(0, -10 - ((1 - a) * distance))

            //console.log(width)
            ctx.translate(-textSize.width / 2, 0)

            ctx.fillText(event.message, 0, 0)
            ctx.restore()
        }
    }

    private drawDamage(ctx: CanvasRenderingContext2D, event: GameEvent) {
        const character = this.getCharacter(event.target)
        if (character) {
            const duration = 2
            const distance = 60

            const now = (new Date()).getTime()
            const a = ((duration - 1) - (((now - event.time) / 1000) % duration)) / (duration - 1)

            ctx.save()
            ctx.translate(character.location.x * this.PIXELS_PER_FOOT, (character.location.y - character.radiusX) * this.PIXELS_PER_FOOT)

            ctx.font = 30 + "px Arial"
            ctx.fillStyle = `rgba(255,0,0,${a})`
            ctx.lineWidth = 2 * this.scale
            const textSize = ctx.measureText(event.amount!.toString())
            ctx.translate(0, -10 - ((1 - a) * distance))

            this.drawHeart(ctx, -0, -40, 50, 60, `rgba(255,255,255,${a})`, `rgba(255,0,0,${a})`)
            //console.log(width)
            ctx.translate(-textSize.width / 2, 0)

            ctx.fillText(event.amount!.toString(), 0, 0)
            ctx.restore()
        }
    }

    drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        var rot = Math.PI / 2 * 3
        var x = cx
        var y = cy
        var step = Math.PI / spikes
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(cx, cy - outerRadius)
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius
            y = cy + Math.sin(rot) * outerRadius
            ctx.lineTo(x, y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius
            y = cy + Math.sin(rot) * innerRadius
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(cx, cy - outerRadius)
        ctx.closePath()
        ctx.lineWidth = 5
        ctx.strokeStyle = 'gold'
        ctx.stroke()
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.restore()
    }

    drawTombstone(ctx: CanvasRenderingContext2D, character: Character) {

        ctx.save()
        ctx.translate(character.location.x * this.PIXELS_PER_FOOT, character.location.y * this.PIXELS_PER_FOOT)
        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.arc(0, 0, 1 * this.PIXELS_PER_FOOT / 1, 0, 2 * Math.PI)
        ctx.fillRect(-this.PIXELS_PER_FOOT, 0, this.PIXELS_PER_FOOT * 2, this.PIXELS_PER_FOOT * 2)
        ctx.fill()

        const claimed = this.player?.claimedCharacters.some((id) => {
            return id == character.id
        })

        if (claimed) {
            //draw a star
            this.drawStar(ctx, 0, 0, 6, 0.8 * this.PIXELS_PER_FOOT, 0.4 * this.PIXELS_PER_FOOT)
        }

        ctx.restore()
    }

    private drawCharacter(ctx: CanvasRenderingContext2D, character: Character) {
        //don't draw dead characters
        //if (character.hp <= -10)
        //return

        const drawControlled = () => {
            const now = (new Date()).getTime()
            const a = (3 + Math.sin(now / 200)) / 4

            ctx.save()
            ctx.rotate(-character.rotation)

            ctx.beginPath()
            ctx.setLineDash([20, 8])

            ctx.strokeStyle = "rgba(255, 215, 0, " + a + ")"
            ctx.lineWidth = 6
            ctx.arc(0, 0, character.radiusX * this.PIXELS_PER_FOOT + 3, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.restore()
        }

        const drawTargeted = () => {
            const now = (new Date()).getTime()
            const a = (3 + Math.sin((now + 3) / 200)) / 4

            ctx.save()
            ctx.rotate(-character.rotation + .2)

            ctx.beginPath()
            ctx.setLineDash([20, 8])

            ctx.strokeStyle = "#bb2930"
            ctx.strokeStyle = "rgba(187, 41, 48, " + a + ")"
            ctx.lineWidth = 6
            ctx.arc(0, 0, character.radiusX * this.PIXELS_PER_FOOT + 3, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.restore()
        }



        ctx.save()
        ctx.translate(character.location.x * this.PIXELS_PER_FOOT, character.location.y * this.PIXELS_PER_FOOT)
        ctx.rotate(-character.rotation)

        const claimed = this.player?.claimedCharacters.some((id) => {
            return id == character.id
        })

        const isControlled = this.player?.controlledCharacter == character.id
        const isTargeted = !!this.player?.controlledCharacter && this.getCharacter(this.player?.controlledCharacter)?.target == character.id

        switch (character.characterClass) {
            case "BARBARIAN":
                ctx.fillStyle = "#9E9EFF"
                break
            case "BARD":
                ctx.fillStyle = "#FFFCAC"
                break
            case "CLERIC":
                ctx.fillStyle = "#171cec"
                break
            case "DRUID":
                ctx.fillStyle = "#A0DBAA"
                break
            case "FIGHTER":
                ctx.fillStyle = "#EDA7A9"
                break
            case "MONK":
                ctx.fillStyle = "#EBD493"
                break
            case "PALADIN":
                ctx.fillStyle = "#CCAADA"
                break
            case "RANGER":
                ctx.fillStyle = "#1ee134"
                break
            case "ROGUE":
                ctx.fillStyle = "#d22b17"
                break
            case "SORCERER":
                ctx.fillStyle = "#F2A2EE"
                break
            case "WIZARD":
                ctx.fillStyle = "#D8A7F3"
                break

            case "ADEPT":
                ctx.fillStyle = "#6c9bff"
                break
            case "ARISTOCRAT":
                ctx.fillStyle = "#ffff7e"
                break
            case "COMMONER":
                ctx.fillStyle = "#f0f0f0"
                break
            case "EXPERT":
                ctx.fillStyle = "#0cae03"
                break
            case "WARRIOR":
                ctx.fillStyle = "#ff6661"
                break
            default:
                ctx.fillStyle = "#808080"
        }

        ctx.save()
        //the fill/inside
        ctx.beginPath()
        ctx.arc(0, 0, character.radiusX * this.PIXELS_PER_FOOT, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()

        //the blured border
        ctx.save()
        ctx.beginPath()
        ctx.arc(0, 0, character.radiusX * this.PIXELS_PER_FOOT - 4 / 2, 0, 2 * Math.PI)
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.restore()

        //the solid border
        ctx.save()
        ctx.beginPath()
        ctx.arc(0, 0, character.radiusX * this.PIXELS_PER_FOOT - 2 / 2, 0, 2 * Math.PI)
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()

        //draw an arrow
        ctx.beginPath()
        ctx.strokeStyle = '#FFFFFF'

        ctx.moveTo(0, 0)
        ctx.lineTo((character.radiusX) * .8 * this.PIXELS_PER_FOOT, 0)

        ctx.stroke()

        //drawHealth()

        if (isTargeted) {
            //draw a special circle around it
            drawTargeted()
        }
        if (isControlled) {
            //draw a special circle around it
            drawControlled()
        }

        if (claimed) {
            //draw a star or something
            this.drawStar(ctx, 0, 0, 6, 0.8 * this.PIXELS_PER_FOOT, 0.4 * this.PIXELS_PER_FOOT)
        }

        ctx.restore()
    }

    drawWorldObject(ctx: CanvasRenderingContext2D, wo: WorldObject) {
        //console.log('drawWorldObject')
        ctx.save()
        ctx.translate(wo.location.x * this.PIXELS_PER_FOOT, wo.location.y * this.PIXELS_PER_FOOT)
        ctx.rotate(-wo.rotation)


        if (wo.shape == SHAPE.CIRCLE) {
            ctx.beginPath()
            ctx.arc(0, 0, wo.radiusX * this.PIXELS_PER_FOOT, 0, 2 * Math.PI)
            ctx.fill()
        }
        else if (wo.shape == SHAPE.ELLIPSE) {
            ctx.beginPath()
            ctx.ellipse(0, 0, wo.radiusX * this.PIXELS_PER_FOOT, wo.radiusY * this.PIXELS_PER_FOOT, 0, 0, 2 * Math.PI)
            ctx.fill()
        }
        else if (wo.shape == SHAPE.OVAL) {
            ctx.beginPath()
            const radius = Math.min(wo.radiusX, wo.radiusY)
            const side = Math.max(wo.radiusX, wo.radiusY) - radius
            //draw the bottom arc
            ctx.arc(0, side * this.PIXELS_PER_FOOT, radius * this.PIXELS_PER_FOOT, 0, Math.PI)
            //draw the top arc
            ctx.arc(0, -side * this.PIXELS_PER_FOOT, radius * this.PIXELS_PER_FOOT, Math.PI, 2 * Math.PI)
            ctx.fill()
        }
        else if (wo.shape == SHAPE.RECT) {
            ctx.save()
            ctx.translate(-wo.width / 2 * this.PIXELS_PER_FOOT, -wo.height / 2 * this.PIXELS_PER_FOOT)
            ctx.beginPath()
            ctx.rect(0, 0, wo.width * this.PIXELS_PER_FOOT, wo.height * this.PIXELS_PER_FOOT)
            ctx.fill()
            ctx.restore()
        }
        else if (wo.shape == SHAPE.TRIANGLE) {
            ctx.strokeText('TRIANGLE', 0, 0)
        }
        else if (wo.shape == SHAPE.COMPOSITE) {
            //draw a dashed line around the composite hitbox
            ctx.save()
            ctx.translate(-wo.width / 2 * this.PIXELS_PER_FOOT, -wo.height / 2 * this.PIXELS_PER_FOOT)
            ctx.beginPath()
            ctx.rect(0, 0, wo.width * this.PIXELS_PER_FOOT, wo.height * this.PIXELS_PER_FOOT)
            ctx.strokeStyle = "lightgray"
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])

            ctx.stroke()
            ctx.restore()

            wo.subObjects.forEach((swo) => {
                this.drawWorldObject(ctx, swo)
            })
        }
        else if (wo.shape == SHAPE.POLY) {
            this.drawPoly(ctx, wo)
        }
        else {
            //console.log(wo.shape)
            //maybe it's using a template
            const template = this.templates.get(wo.shape)
            if (!!template) {
                //console.log('template', template)

                const merged = { ...template, id: wo.id }
                //console.log('merged', merged)
                this.drawWorldObject(ctx, merged)
            }
            else {
                ctx.strokeText(wo.shape, 0, 0)
            }
        }

        ctx.restore()
    }

    drawPoly(ctx: CanvasRenderingContext2D, wo: WorldObject) {
        ctx.save()
        ctx.beginPath()

        wo.points.forEach((p, i) => {
            //console.log(p)
            if (i == 0) {
                ctx.moveTo(p.x * this.PIXELS_PER_FOOT, p.y * this.PIXELS_PER_FOOT)
            }
            else {
                ctx.lineTo(p.x * this.PIXELS_PER_FOOT, p.y * this.PIXELS_PER_FOOT)
            }
        })

        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }

    createCharacter() {
        this.socket?.emit(CONSTANTS.CREATE_CHARACTER)
    }

    createObject() {
        this.socket?.emit(CONSTANTS.CREATE_OBJECT)
    }

    createCommunity(options: { size: string, race: string }) {
        //get client center
        const origin = this.getViewPortOrigin()
        //console.log(origin)
        //console.log({ ...options, location: origin })
        this.socket?.emit(CONSTANTS.CREATE_COMMUNITY, { ...options, location: origin })
    }

    move(characterId: string, location: Point) {
        this.gameEngine.moveCharacter(characterId, location)
        this.socket?.emit(CONSTANTS.MOVE_TO, characterId, location)
    }

    clickHandler(e: React.MouseEvent) {
        e.nativeEvent.stopImmediatePropagation()
        e.nativeEvent.stopPropagation()
        e.stopPropagation()
        e.preventDefault()
    }

    doubleClickHandler(e: React.MouseEvent) {
        e.nativeEvent.stopImmediatePropagation()
        e.nativeEvent.stopPropagation()
        e.stopPropagation()
        e.preventDefault()
        //console.log('doubleclick')
        const characters = this.gameEngine.gameWorld.getCharactersAt(this.getGamePosition(e.nativeEvent))

        //if logged in 
        if (!!this.player) {
            //if no controlled character, and still under maxclaimedcharacter limit or already claimed this character
            if (characters.length > 0 &&
                (!this.player?.controlledCharacter && (this.player?.claimedCharacters.length < this.player.maxClaimedCharacters) ||
                    (this.player?.claimedCharacters.some((id) => id == characters[0].id))
                )) {
                //then control(server should handle claiming first if needed)
                this.control(characters[0].id)
            }
            //controlled character, so target is a target
            else if (!!this.player?.controlledCharacter && characters.length > 0) {
                //attack it
                this.attack(this.player?.controlledCharacter, characters[0].id)
            }
            //controlled character, but no target, so clear target
            else if (!!this.player?.controlledCharacter && !!this.getCharacter(this.player?.controlledCharacter)?.target && characters.length == 0) {
                //console.log('clearing attackee')
                this.attackStop(this.player?.controlledCharacter)
            }
        }
    }

    rightClickHandler(e: React.MouseEvent) {
        const characters = this.gameEngine.gameWorld.getCharactersAt(this.getGamePosition(e.nativeEvent))

        //console.log('client engine right click handler')

        //console.log('this.player?.controlledCharacter', this.player?.controlledCharacter)

        if (!!this.player?.controlledCharacter) {
            const location = this.getGamePosition(e.nativeEvent)
            this.move(this.player.controlledCharacter, location)
        }
    }

    attackStop(attackerId: string) {
        this.gameEngine.attackStop(attackerId)
        //tell the server
        this.socket?.emit(CONSTANTS.ATTACK, attackerId, undefined)
    }

    attack(attackerId: string, attackeeId: string) {
        this.gameEngine.attack(attackerId, attackeeId, true, true)
        //tell the server
        this.socket?.emit(CONSTANTS.ATTACK, attackerId, attackeeId)
    }

    private getZonesInViewPort() {
        return this.gameEngine.getZonesIn(this.getViewPort())
    }

    castSpell(casterId: string, spellName: string, targets: string[]) {
        //todo maybe don't tell the local gameengine because the damage will end up being wrong?
        //console.log('spellName', spellName)
        //console.log('casterId', casterId)
        //console.log('targets', targets)
        this.gameEngine.castSpell(casterId, spellName, targets)
        this.socket?.emit(CONSTANTS.CAST_SPELL, { casterId: casterId, spellName: spellName, targets: targets })
    }

    private getViewPortOrigin() {
        const rect = this.getCanvas().getBoundingClientRect()
        const middleX = (rect.right - rect.left) / this.PIXELS_PER_FOOT * this.scale / 2 + this.translateX
        const middleY = (rect.bottom - rect.top) / this.PIXELS_PER_FOOT * this.scale / 2 + this.translateY
        return { x: middleX, y: middleY }
    }

    getGamePosition(p: Point) {
        const rect = this.getCanvas().getBoundingClientRect()
        const y = (p.y - rect.top + (this.translateY * this.PIXELS_PER_FOOT / this.scale)) / this.PIXELS_PER_FOOT * this.scale
        const x = (p.x - rect.left + (this.translateX * this.PIXELS_PER_FOOT / this.scale)) / this.PIXELS_PER_FOOT * this.scale

        //console.log('y', y)
        return { x, y }
    }

    getScreenPosition(p: Point) {
        const rect = this.getCanvas().getBoundingClientRect()
        const y = p.y * this.PIXELS_PER_FOOT / this.scale - (this.translateY * this.PIXELS_PER_FOOT / this.scale) + rect.top
        const x = p.x * this.PIXELS_PER_FOOT / this.scale - (this.translateX * this.PIXELS_PER_FOOT / this.scale) + rect.left
        return { x, y }
    }

    getCharacterAt(position: Point) {
        return this.gameEngine.gameWorld.getCharacterAt(position)
    }

    keyDownHandler(e: KeyboardEvent) {
        const code = e.code

        if (this.player?.controlledCharacter) {
            if (code == 'KeyD') {
                this.turnRight(this.player.controlledCharacter)
            }
            else if (code == 'KeyA') {
                this.turnLeft(this.player.controlledCharacter)
            }
            else if (code == 'KeyS') {
                this.decelarate(this.player.controlledCharacter)
            }
            else if (code == 'KeyW') {
                this.accelerate(this.player.controlledCharacter)
            }
            else if (code == "ShiftLeft") {
                this.accelerateDouble(this.player.controlledCharacter)
            }
        }
    }

    private accelerateDouble(characterId: string) {
        const character = this.getCharacter(characterId)
        if (character) {
            const c = this.gameEngine.accelerateDouble(characterId, this.player?.id)
            if (c) {
                this.socket?.emit(CONSTANTS.ACCELERATE_DOUBLE, characterId)
            }
        }
    }

    private accelerate(characterId: string) {
        const change: boolean = this.gameEngine.accelerate(characterId, this.player?.id)
        if (change) {
            //only send this if not already accelerating
            this.socket?.emit(CONSTANTS.ACCELERATE, characterId)
        }
    }

    private decelarate(characterId: string) {
        const character = this.gameEngine.decelerate(characterId, this.player?.id)
        if (!!character) {
            this.socket?.emit(CONSTANTS.DECELERATE, characterId)
        }
    }

    private turnLeft(characterId: string) {
        const character = this.gameEngine.turnLeft(characterId, this.player?.id)
        if (!!character) {
            this.socket?.emit(CONSTANTS.TURN_LEFT, characterId)
        }
    }

    private turnRight(characterId: string) {
        const character = this.gameEngine.turnRight(characterId, this.player?.id)
        if (!!character) {
            this.socket?.emit(CONSTANTS.TURN_RIGHT, characterId)
        }
    }

    private accelerateDoubleStop(characterId: string) {
        const character = this.gameEngine.accelerateDoubleStop(characterId, this.player?.id)
        if (!!character) {
            this.socket?.emit(CONSTANTS.STOP_DOUBLE_ACCELERATE, characterId)
        }
    }

    private accelerateStop(characterId: string) {
        const character = this.gameEngine.accelerateStop(characterId, this.player?.id)
        if (!!character) {
            this.socket?.emit(CONSTANTS.STOP_ACCELERATE, characterId)
        }
    }

    private turnStop(characterId: string) {
        const character = this.gameEngine.turnStop(characterId, this.player?.id)
        if (!!character) {
            this.socket?.emit(CONSTANTS.TURN_STOP, characterId)
        }
    }

    keyUpHandler(e: KeyboardEvent) {
        if (this.player?.controlledCharacter) {
            if (e.code == 'KeyD') {
                this.turnStop(this.player.controlledCharacter)
            }
            else if (e.code == 'KeyA') {
                this.turnStop(this.player.controlledCharacter)
            }
            else if (e.code == 'KeyS') {
                this.accelerateStop(this.player.controlledCharacter)
            }
            else if (e.code == 'KeyW') {
                this.accelerateStop(this.player.controlledCharacter)
            }
            else if (e.code == "ShiftLeft") {
                this.accelerateDoubleStop(this.player.controlledCharacter)
            }
        }
    }

    onMouseMove(position: Point, movement: Point, buttons: number) {
        this.mousePosition = position
        if (!!buttons) {
            this.translateX -= (movement.x / this.PIXELS_PER_FOOT * this.scale)
            this.translateY -= (movement.y / this.PIXELS_PER_FOOT * this.scale)
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
                this.onConnect()
            })

            this.socket?.on(CONSTANTS.CURRENT_PLAYER, (player: Player) => {
                this.player = player
                //this.emit(CONSTANTS.CURRENT_PLAYER, player)
            })

            //disconnect handler
            this.socket?.on(CONSTANTS.DISCONNECT, (reason: any) => {
                this.onDisconnect(reason)
            })

            this.socket?.on(CONSTANTS.CHAT, (chat: GameEvent) => {
                //console.log(chat)
                this.game_events = this.game_events.concat(chat)
                if (chat.message) {
                    this.updateChat(chat?.message)
                }
            })

            this.socket?.on(CONSTANTS.GAME_EVENTS, (events: GameEvent[]) => {
                this.game_events = this.game_events.concat(events)
            })

            //character location data
            this.socket?.on(CONSTANTS.CLIENT_CHARACTER_UPDATE, (characters: Character[]) => {
                //tell the gameengine we got an update 
                //console.log('characters',characters)
                this.gameEngine.updateCharacters(characters)
            })

            //world object location data
            this.socket?.on(CONSTANTS.WORLD_OBJECTS, (worldObjects: WorldObject[]) => {
                //tell the gameengine we got an update 
                //console.log('worldObjects',worldObjects)
                this.gameEngine.updateObjects(worldObjects)
            })

            //template data
            this.socket?.on(CONSTANTS.TEMPLATE_OBJECTS, (templates: [string, WorldObject][]) => {
                //console.log('templates', templates)
                this.templates = new Map<string, WorldObject>(templates)
                //console.log('this.templates', this.templates)

            })
        }
        catch (e) {
            //something went wrong
            console.log(e)
            return false
        }

        return true
    }

    private onDisconnect(reason: any) {
        console.log('DISCONNECT', reason)
        this.connected = false
        //this.emit(CONSTANTS.DISCONNECT)
    }

    private onServerInitial(characters: Character[]) {
        //console.log(characters)
        this.gameEngine.updateCharacters(characters)
    }

    private onConnect() {
        console.log('successfully connected to the server')
        this.connected = true
        //tell the ui we connected
        //this.emit(CONSTANTS.CONNECT)

        //restart/reset the gameengine and gameworld
        this.gameEngine.restart()

        //ask the server for characters
        this.socket?.emit(CONSTANTS.CLIENT_VIEWPORT, this.getViewPort() as ViewPort)
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