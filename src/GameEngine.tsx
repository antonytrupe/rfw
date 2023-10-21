"use client"
import EventEmitter from "events";
import { Character as Character } from "../app/worldSlice";
import { TURN_RIGHT, TURN_LEFT, DECELERATE, ACCELERATE, CHARACTER_LOCATION as CHARACTER_LOCATION } from "./CONSTANTS";
import GameWorld from "./GameWorld";

export default class GameEngine {
    //EventEmitter function
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    emit: (eventName: string | symbol, ...args: any[]) => boolean;
    eventNames: () => (string | symbol)[];
    //data object
    gameWorld: GameWorld = new GameWorld()

    constructor(eventEmitter: EventEmitter) {
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.eventNames = eventEmitter.eventNames.bind(eventEmitter)

        this.on(TURN_RIGHT, () => {
            console.log('on', TURN_RIGHT)
        })
        this.on(TURN_LEFT, () => {
            console.log('on', TURN_LEFT)
        })
        this.on(DECELERATE, () => {
            console.log('on', DECELERATE)
        })
        this.on(ACCELERATE, () => {
            console.log('on', ACCELERATE)
        })

        this.on(CHARACTER_LOCATION, (character) => {
            this.gameWorld.updateCharacter(character)

        })
    }
    lastTimestamp: DOMHighResTimeStamp | undefined
    step() {
        const now = (new Date()).getTime()
        this.lastTimestamp = this.lastTimestamp || now
        const dt = now - this.lastTimestamp

        this.gameWorld.characters.map((character) => {
            const newX = character.location.x + character.vector.velocity * Math.cos(character.vector.angle) * dt
            const newY = character.location.y + character.vector.velocity * Math.sin(character.vector.angle) * dt
            return { ...character, location: { x: newX, y: newY } }
        })
        setTimeout(this.step.bind(this), 16);
    }

    start() {
        setTimeout(this.step.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function') {
            //   window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
        return this;
    }
}