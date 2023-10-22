"use client"
import EventEmitter from "events";
import Character from "../app/Character";
import { TURN_RIGHT, TURN_LEFT, DECELERATE, ACCELERATE, CHARACTER_LOCATION as CHARACTER_LOCATION, STOP_ACCELERATE, TURN_STOP, DECELERATE_DOUBLE, ACCELERATE_DOUBLE, STOP_DOUBLE_ACCELERATE } from "./CONSTANTS";
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
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: -1 })
            })
        })
        this.on(TURN_LEFT, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 1 })
            })
        })
        this.on(TURN_STOP, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 0 })
            })
        })
        this.on(DECELERATE_DOUBLE, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, mode: 2 })
            })
        })
        this.on(ACCELERATE_DOUBLE, (characters: Character[]) => {
            characters.forEach((character: Character) => {
                this.gameWorld.updateCharacter({ id: character.id, mode: 2 })
            })
        })
        this.on(DECELERATE, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: -1 })
            })
        })
        this.on(ACCELERATE, (characters: Character[]) => {
            characters.forEach((character: Character) => {
                this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 1 })
            })
        })
        this.on(STOP_ACCELERATE, (characters: Character[]) => {
            //console.log('GameEngine on', 'STOP_ACCELERATE')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 0 })
            })
        })
        this.on(STOP_DOUBLE_ACCELERATE, (characters: Character[]) => {
            //console.log('GameEngine on', 'STOP_ACCELERATE')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, mode: 1 })
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
    turnMultiplier: number = 420
    //1px/ft
    //5ft/s*1000ms/s
    speedMultiplier: number = 5000
    step() {
        //console.log('GameEngine.step')
        const now = (new Date()).getTime()
        this.lastTimestamp = this.lastTimestamp || now
        const dt = now - this.lastTimestamp
        this.lastTimestamp = now

        this.gameWorld.characters = this.gameWorld.characters.map((character: Character): Character => {

            //calculate the new angle
            let newAngle = character.direction
            if (character.directionAcceleration != 0) {
                newAngle = character.direction - character.directionAcceleration * dt / this.turnMultiplier
            }

            let newX: number = character.x
            let newY: number = character.y
            if (character.speed != 0) {
                //calculate new position
                newX = character.x + character.speed * Math.sin(character.direction) * dt / this.speedMultiplier
                newY = character.y - character.speed * Math.cos(character.direction) * dt / this.speedMultiplier
            }

            let newSpeed = 0
            //calculate new speed
            if (character.speedAcceleration != 0) {
                //TODO slow down the transition from sprint to run
                newSpeed = Math.max(-character.maxSpeed * character.mode, Math.min(character.speed + character.speedAcceleration * dt / this.accelerationMultiplier, character.maxSpeed * character.mode))
                //console.log('new speed', newSpeed)
            }
            else if (character.speed > 0) {
                //slow down
                newSpeed = Math.max(character.speed - dt / this.accelerationMultiplier, 0)
            }
            else if (character.speed < 0) {
                newSpeed = Math.min(character.speed + dt / this.accelerationMultiplier, 0)

            }
            return { ...character, x: newX, y: newY, speed: newSpeed, direction: newAngle }
        })
        //60 frames per second is one frame every ~17 milliseconds
        //30 frames per second is one frame every ~33 milliseconds
        setTimeout(this.step.bind(this), 20);
    }

    start() {
        //console.log('GameEngine.start')
        setTimeout(this.step.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function') {
            //   window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
        return this;
    }
}