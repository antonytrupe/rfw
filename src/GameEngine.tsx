"use client"
import EventEmitter from "events";
import Character from "../app/Character";
import { TURN_RIGHT, TURN_LEFT, DECELERATE, ACCELERATE, CHARACTER_LOCATION as CHARACTER_LOCATION, STOP_ACCELERATE, TURN_STOP } from "./CONSTANTS";
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

        this.on(TURN_RIGHT, (characters: Character[]) => {
            //console.log('on', TURN_RIGHT)
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, turnDirection: -1 })
            })
        })
        this.on(TURN_LEFT, (characters: Character[]) => {
            // console.log('on', TURN_LEFT)
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, turnDirection: 1 })
            })
        })
        this.on(TURN_STOP, (characters: Character[]) => {
            //console.log('on', TURN_STOP)
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, turnDirection: 0 })
            })
        })
        this.on(DECELERATE, (characters: Character[]) => {
            console.log('GameEngine on', 'DECELERATE')
            //TODO
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, acceleration: -1 })
            })
        })
        this.on(ACCELERATE, (characters: Character[]) => {
            console.log('GameEngine on', 'ACCELERATE')
            //TODO
            characters.forEach((character: Character) => {
                this.gameWorld.updateCharacter({ id: character.id, acceleration: 1 })
            })
        })
        this.on(STOP_ACCELERATE, (characters: Character[]) => {
            console.log('GameEngine on', 'STOP_ACCELERATE')
            //TODO
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, acceleration: 0 })
            })
        })

        this.on(CHARACTER_LOCATION, (character) => {
            console.log('CHARACTER_LOCATION')
            this.gameWorld.updateCharacter(character)

        })
    }
    lastTimestamp: DOMHighResTimeStamp | undefined
    step() {
        //console.log('GameEngine.step')
        const now = (new Date()).getTime()
        this.lastTimestamp = this.lastTimestamp || now
        const dt = now - this.lastTimestamp

        this.gameWorld.characters = this.gameWorld.characters.map((character: Character): Character => {

            //calculate the new angle
            let newAngle = character.angle
            if (character.turnDirection != 0) {
                newAngle = character.angle + character.turnDirection * dt / 10000000
            }

            let newX: number = character.x
            let newY: number = character.y
            if (character.speed != 0) {
                //calculate new position
                newX = character.x + character.speed * Math.cos(character.angle) * dt / 1000000
                newY = character.y - character.speed * Math.sin(character.angle) * dt / 1000000
                //console.log('newX', newX)
            }
            let newSpeed = character.speed
            //calculate new speed
            if (character.acceleration != 0) {
                //console.log(character.acceleration)
                newSpeed = Math.max(-character.maxSpeed, Math.min(character.speed + character.acceleration * dt / 1000000, character.maxSpeed))
                //console.log('new speed', newSpeed)
            }
            else if (character.speed != 0) {
                //slow down
                console.log(character.speed)
                newSpeed = Math.max(character.speed - dt / 1000000, 0)
            }
            else {
                //console.log(character.speed)
            }
            return { ...character, x: newX, y: newY, speed: newSpeed, angle: newAngle }
        })
        //60 frames per second is one frame every 16.66 milliseconds
        setTimeout(this.step.bind(this), 200);
    }

    start() {
        setTimeout(this.step.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function') {
            //   window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
        return this;
    }
}