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

    ticksPerSecond: number

    lastTimestamp: DOMHighResTimeStamp | undefined
    //lower number means faster, higher means slower
    accelerationMultiplier: number = 20
    turnMultiplier: number = 1000 / Math.PI
    //1px/ft
    //5ft/s*1000ms/s
    //30ft/6seconds
    speedMultiplier: number = 6000

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
            //console.log('CONSTANTS.WORLD_UPDATE')
            this.gameWorld.characters = gameWorld.characters
        })
    }
    //this is the wrapper and callback function that calls step
    tick() {
        const now = (new Date()).getTime()
        this.lastTimestamp = this.lastTimestamp || now
        const dt = now - this.lastTimestamp
        this.lastTimestamp = now
        this.step(dt)

        //60 frames per second is one frame every ~17 milliseconds
        //30 frames per second is one frame every ~33 milliseconds
        setTimeout(this.tick.bind(this), 1000 / this.ticksPerSecond);
    }

    step(dt: number) {
        //console.log('GameEngine.step')

        const updatedCharacters: Character[] = []

        this.gameWorld.characters = this.gameWorld.characters.map((character: Character): Character => {

            //calculate the new angle
            let newDirection = this.calculateDirection(character, dt);

            let newSpeed = this.calculateSpeed(character, dt);

            let { newX, newY }: { newX: number; newY: number; } = this.calculatePosition({ ...character, speed: newSpeed }, dt);


            //  compare the values and see if they are different at all
            if (!isEqual({ ...character, x: newX, y: newY, speed: newSpeed, direction: newDirection }, character)) {
                updatedCharacters.push({ ...character, x: newX, y: newY, speed: newSpeed, direction: newDirection })
            }

            return { ...character, x: newX, y: newY, speed: newSpeed, direction: newDirection }
        })

        //TODO is this the right place?
        if (updatedCharacters.length > 0) {
            this.emit(CONSTANTS.SERVER_CHARACTER_UPDATE, updatedCharacters)
        }
    }

    private calculateDirection(character: Character, dt: number) {
        let newAngle = character.direction;
        if (character.directionAcceleration != 0) {
            newAngle = character.direction - character.directionAcceleration * dt / this.turnMultiplier;
        }
        //keep it from growing
        newAngle %= (Math.PI * 2)
        return newAngle;
    }

    private calculateSpeed(character: Character, dt: number) {
        let newSpeed = 0;
        //soft caps might be the same as hard caps
        //if mode or acceleration are 0 then the soft caps get pushed to 0
        const currentModeMaxSpeed = character.maxSpeed * character.mode * character.speedAcceleration;
        const currentModeMinSpeed = -character.maxSpeed * character.mode * character.speedAcceleration;
        let mode = character.mode;

        let outsideSoftCaps = currentModeMinSpeed > character.speed || character.speed > currentModeMaxSpeed
        //    console.log('outsideSoftCaps', outsideSoftCaps)
        let accel = character.speedAcceleration
        //if we're outside soft caps or acceleration is 0 and we're moving
        if (outsideSoftCaps || (character.speedAcceleration == 0 && character.speed != 0)) {
            // console.log('forcing sprinting')
            //force sprinting
            mode = 2;
            //force a direction if acceleration is 0 but we need to slow down
            //force acceleration in the opposite direction of movement
            if (character.speed > 0) {
                accel = -1
            }
            else if (character.speed < 0) {
                accel = 1
            }
        }
        //calculate the speedDelta now that we're taking into account slowing down
        let speedDelta = accel * mode * dt / this.accelerationMultiplier;
        // console.log('speedDelta', speedDelta)

        //if the character is trying to stop
        if (character.speedAcceleration == 0) {
            //
            if (character.speed > 0) {
                //character is not accellerating while moving forward
                //don't let the character go slower the 0
                newSpeed = Math.max(0, character.speed + speedDelta)
                //console.log(newSpeed)
            }
            else if (character.speed < 0) {
                //ceiling the new speed at 0
                //character is not accellerating while moving backward
                //don't let the character go faster the 0
                newSpeed = Math.min(0, character.speed + speedDelta)
            }
        }
        //character is accelerating forward
        else if (character.speedAcceleration > 0) {
            //character is already moving forward
            if (character.speed >= 0) {
                //accelerating forward while moving forward 
                //don't let the character go faster maxspeed*mode
                newSpeed = Math.min(character.maxSpeed * character.mode, character.speed + speedDelta)
                //if we started out going faster then the new speed
                if (character.speed > newSpeed) {
                    //then don't slow down to less then the softmax
                    newSpeed = Math.max(currentModeMaxSpeed, newSpeed)
                }
                // console.log(newSpeed)
            }
            else if (character.speed < 0) {
                //accelerating forward while going backwards
                //don't let the character go faster then maxspeed*mode
                newSpeed = Math.min(currentModeMaxSpeed, character.speed + speedDelta)
            }
        }
        //character is accelerating backward
        else {
            //character is already moving forward
            if (character.speed >= 0) {
                //accelerating backwards while moving forwards
                //don't let the character go slower then maxspeed*mode
                newSpeed = Math.max(currentModeMinSpeed, character.speed + speedDelta)
            }
            else if (character.speed < 0) {
                //accelerating backwards whlie moving backwards
                //don't let the character go slower then -maxspeed*mode
                newSpeed = Math.max(currentModeMinSpeed, character.speed + speedDelta)
                //character started out going backwards faster then newspeed
                if (character.speed < newSpeed) {
                    //then don't slow down to less then the softmax
                    newSpeed = Math.min(currentModeMinSpeed, newSpeed)
                }
            }
        }
        //calculate hard caps using sprint and old speed
        const hardMax = character.maxSpeed * 2
        const hardMin = -character.maxSpeed * 2
        // console.log('hardMax', hardMax)
        // console.log('hardMin', hardMin)
        newSpeed = Math.max(hardMin, Math.min(newSpeed, hardMax));
        //if we started inside the softcaps
        if (!outsideSoftCaps) {
            //then stay capped to them
            newSpeed = Math.max(currentModeMinSpeed, Math.min(newSpeed, currentModeMaxSpeed));
        }
        else {
            //if we started outside the softcaps
        }


        return newSpeed;
    }

    private calculatePosition(character: Character, dt: number) {
        let newX: number = character.x;
        let newY: number = character.y;
        if (character.speed != 0) {
            //calculate new position
            newX = character.x + character.speed * Math.sin(character.direction) * dt / this.speedMultiplier;
            newY = character.y - character.speed * Math.cos(character.direction) * dt / this.speedMultiplier;
        }
        return { newX, newY };
    }

    start() {
        //console.log('GameEngine.start')
        setTimeout(this.tick.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function') {
            //   window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
        return this;
    }
}