"use client"
import EventEmitter from "events";
import Character from "./Character";
import * as CONSTANTS from "./CONSTANTS";
import GameWorld from "./GameWorld";
import { v4 as uuidv4 } from 'uuid';
import isEqual from 'lodash.isequal';


export default class GameEngine {
    //EventEmitter function
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    emit: (eventName: string | symbol, ...args: any[]) => boolean;
    eventNames: () => (string | symbol)[];
    //data object
    gameWorld: GameWorld

    ticksPerSecond: number = 1

    lastTimestamp: DOMHighResTimeStamp | undefined
    //lower number means faster, higher means slower
    accelerationMultiplier: number = 20
    turnMultiplier: number = 420
    //1px/ft
    //5ft/s*1000ms/s
    speedMultiplier: number = 5000

    constructor({ ticksPerSecond }: { ticksPerSecond: number }, eventEmitter: EventEmitter) {
        this.gameWorld = new GameWorld()
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.eventNames = eventEmitter.eventNames.bind(eventEmitter)
        this.ticksPerSecond = ticksPerSecond

        this.on(CONSTANTS.CREATE_CHARACTER, () => {
            //console.log('gameengine CREATE_CHARACTER')
            let x = Math.random() * 60 + 10
            let y = Math.random() * 60 + 10
            const id = uuidv4()
            let p = new Character({ id: id, size: 5, x: x, y: y })
            this.gameWorld.characters.push(p)

            //tell the server engine there's a character update so it can save it and update clients
            this.emit(CONSTANTS.SERVER_CHARACTER_UPDATE, [p])
        })

        this.on(CONSTANTS.TURN_RIGHT, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: -1 })
            })
        })
        this.on(CONSTANTS.TURN_LEFT, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 1 })
            })
        })
        this.on(CONSTANTS.TURN_STOP, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 0 })
            })
        })
        this.on(CONSTANTS.DECELERATE_DOUBLE, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, mode: 2 })
            })
        })
        this.on(CONSTANTS.ACCELERATE_DOUBLE, (characters: Character[]) => {
            characters.forEach((character: Character) => {
                this.gameWorld.updateCharacter({ id: character.id, mode: 2 })
            })
        })
        this.on(CONSTANTS.DECELERATE, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: -1 })
            })
        })
        this.on(CONSTANTS.ACCELERATE, (characters: Character[]) => {
            characters.forEach((character: Character) => {
                this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 1 })
            })
        })
        this.on(CONSTANTS.STOP_ACCELERATE, (characters: Character[]) => {
            //console.log('GameEngine on', 'STOP_ACCELERATE')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 0 })
            })
        })
        this.on(CONSTANTS.STOP_DOUBLE_ACCELERATE, (characters: Character[]) => {
            //console.log('GameEngine on', 'STOP_ACCELERATE')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, mode: 1 })
            })
        })

         //got an update from the clientengine
         this.on(CONSTANTS.CLIENT_CHARACTER_UPDATE, (characters: Character[]) => {
            //console.log('CHARACTER_LOCATION')
            characters.forEach((character) => {
                this.gameWorld.updateCharacter(character)
            })
        })

        //got an update from the clientengine
        this.on(CONSTANTS.WORLD_UPDATE, (gameWorld: GameWorld) => {
            console.log('CONSTANTS.WORLD_UPDATE')
            this.gameWorld.characters=gameWorld.characters
        })
    }

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
            //TODO compare the values and see if they are different at all
            if (!isEqual({ ...character, x: newX, y: newY, speed: newSpeed, direction: newAngle }, character)) {

            }

            return { ...character, x: newX, y: newY, speed: newSpeed, direction: newAngle }
        })
        //60 frames per second is one frame every ~17 milliseconds
        //30 frames per second is one frame every ~33 milliseconds
        setTimeout(this.step.bind(this), 1000 / this.ticksPerSecond);
        //TODO is this the right place?
        this.emit(CONSTANTS.SERVER_CHARACTER_UPDATE, this.gameWorld.characters)
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