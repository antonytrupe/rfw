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
        console.log('GameEngine.constructor')
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.eventNames = eventEmitter.eventNames.bind(eventEmitter)

        this.on(TURN_RIGHT, (characters: Character[]) => {
            //console.log('GameEngine on', 'TURN_RIGHT')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, turnDirection: -1 })
            })
        })
        this.on(TURN_LEFT, (characters: Character[]) => {
            //console.log('GameEngine on', 'TURN_LEFT')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, turnDirection: 1 })
            })
        })
        this.on(TURN_STOP, (characters: Character[]) => {
            //console.log('GameEngine on', 'TURN_STOP')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, turnDirection: 0 })
            })
        })
        this.on(DECELERATE, (characters: Character[]) => {
            //console.log('GameEngine on', 'DECELERATE')
            //TODO
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, acceleration: -1 })
            })
        })
        this.on(ACCELERATE, (characters: Character[]) => {
            //console.log('GameEngine on', 'ACCELERATE')
            //TODO
            characters.forEach((character: Character) => {
                this.gameWorld.updateCharacter({ id: character.id, acceleration: 1 })
            })
        })
        this.on(STOP_ACCELERATE, (characters: Character[]) => {
            //console.log('GameEngine on', 'STOP_ACCELERATE')
            //TODO
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, acceleration: 0 })
            })
        })

        this.on(CHARACTER_LOCATION, (character) => {
            //console.log('CHARACTER_LOCATION')
            this.gameWorld.updateCharacter(character)

        })
    }
    lastTimestamp: DOMHighResTimeStamp | undefined
    //lower number means faster, higher means slower
    accelerationMultiplier: number = 20
    turnMultiplier: number = 300
    speedMultiplier: number = 5000
    step() {
        //console.log('GameEngine.step')
        const now = (new Date()).getTime()
        this.lastTimestamp = this.lastTimestamp || now
        const dt = now - this.lastTimestamp
        this.lastTimestamp = now
        //console.log(dt)

        this.gameWorld.characters = this.gameWorld.characters.map((character: Character): Character => {

            //calculate the new angle
            let newAngle = character.angle
            if (character.turnDirection != 0) {
                newAngle = character.angle + character.turnDirection * dt / this.turnMultiplier
            }

            let newX: number = character.x
            let newY: number = character.y
            if (character.speed != 0) {
                //calculate new position
                newX = character.x + character.speed * Math.cos(character.angle) * dt / this.speedMultiplier
                newY = character.y - character.speed * Math.sin(character.angle) * dt / this.speedMultiplier
                //console.log('newX', newX)
            }

            if (character.acceleration == 0 && character.speed != 0) {
                //console.log('slowing down speed', character.speed)
            }

            let newSpeed = 0
            //calculate new speed
            if (character.acceleration != 0) {
                //console.log('accelerating speed',character.speed)
                //console.log(character.acceleration)
                newSpeed = Math.max(-character.maxSpeed, Math.min(character.speed + character.acceleration * dt / this.accelerationMultiplier, character.maxSpeed))
                //console.log('new speed', newSpeed)
            }
            else if (character.speed > 0) {
                //slow down
                //console.log('speed', character.speed)
                newSpeed = Math.max(character.speed - dt / this.accelerationMultiplier, 0)
                //console.log(newSpeed)

            }
            else if (character.speed < 0) {
                //console.log('speed', character.speed)
                newSpeed = Math.min(character.speed + dt / this.accelerationMultiplier, 0)

            }
            if (newSpeed == 0 && character.speed != 0) {
                //console.log('STOPPED----------')
            }
            return { ...character, x: newX, y: newY, speed: newSpeed, angle: newAngle }
        })
        //60 frames per second is one frame every 16.66 milliseconds
        setTimeout(this.step.bind(this), 17);
    }

    start() {
        console.log('GameEngine.start')
        setTimeout(this.step.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function') {
            //   window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
        return this;
    }
}