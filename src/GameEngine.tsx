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

    turnLeft = (characters: Character[]) => {
        characters.forEach((character) => {
            this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 1 })
        })
    }

    updateCharacters(characters: Character[]) {
        // console.log(characters)
        characters.forEach((character) => {
            this.gameWorld.updateCharacter(character)
        })
    }

    constructor({ ticksPerSecond }: { ticksPerSecond: number }, eventEmitter: EventEmitter) {
        this.gameWorld = new GameWorld()
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.eventNames = eventEmitter.eventNames.bind(eventEmitter)
        this.ticksPerSecond = ticksPerSecond

        this.on(CONSTANTS.CREATE_CHARACTER, () => {
            //console.log('gameengine CREATE_CHARACTER')
            this.createCharacter({});
        })

        this.on(CONSTANTS.TURN_RIGHT, (characters: Character[]) => {
            characters.forEach((character) => {
                this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: -1 })
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
        this.on(CONSTANTS.WORLD_UPDATE, (gameWorld: GameWorld) => {
            //console.log('CONSTANTS.WORLD_UPDATE')
            this.gameWorld.characters = gameWorld.characters
        })
    }
    private createCharacter(character: Partial<Character>) {
        let originX = 0
        let originY = 0
        let spreadX = 30
        let spreadY = 30

        let x = originX + Math.random() * spreadX - spreadX / 2;
        let y = originY + Math.random() * spreadY - spreadY / 2;
        const id = uuidv4();
        let maxHp = Math.max(1, Math.floor(Math.random() * 5) - 1)

        const merged = { ...character, id: id, size: 5, x: x, y: y, maxHp: maxHp, hp: maxHp };
        let p = new Character(merged);
        this.gameWorld.characters.push(p);

        //tell the server engine there's a character update so it can save it and update clients
        this.emit(CONSTANTS.SERVER_CHARACTER_UPDATE, [p]);
        return p
    }

    private populateClass(className: string, diceCount: number, diceSize: number, modifier: number) {
        const updatedCharacters: Character[] = []
        const highestLevel = this.roll({ size: diceSize, count: diceCount, modifier: modifier });
        // work our way down from highest level
        for (let level = highestLevel; level >= 1; level /= 2) {
            //console.log('level', level);
            //make the right amount of each level
            for (let i = 0; i < highestLevel / level; i++) {
                updatedCharacters.push(this.createCharacter({ characterClass: className, level: Math.round(level) }));
            }
        }
        return updatedCharacters
    }

    createCommunity(size: string) {
        console.log('createCommunity')
        let updatedCharacters: Character[] = []
        switch (size) {
            case "THORP":
                let modifier = -3
                let totalSize = this.roll({ size: 60, modifier: 20 })

                //pc classes
                //barbarians
                updatedCharacters = updatedCharacters.concat(this.populateClass('BARBARIAN', 1, 4, modifier))
                //bards
                updatedCharacters = updatedCharacters.concat(this.populateClass('BARD', 1, 6, modifier))
                //clerics
                updatedCharacters = updatedCharacters.concat(this.populateClass('CLERIC', 1, 6, modifier))
                //druid
                updatedCharacters = updatedCharacters.concat(this.populateClass('DRUID', 1, 6, modifier))
                //fighter
                updatedCharacters = updatedCharacters.concat(this.populateClass('FIGHTER', 1, 8, modifier))
                //monk
                updatedCharacters = updatedCharacters.concat(this.populateClass('MONK', 1, 4, modifier))
                //paladin
                updatedCharacters = updatedCharacters.concat(this.populateClass('PALADIN', 1, 3, modifier))
                //ranger
                updatedCharacters = updatedCharacters.concat(this.populateClass('RANGER', 1, 3, modifier))
                //rogue
                updatedCharacters = updatedCharacters.concat(this.populateClass('ROGUE', 1, 8, modifier))
                //sorcerer
                updatedCharacters = updatedCharacters.concat(this.populateClass('SORCERER', 1, 4, modifier))
                //warrior
                updatedCharacters = updatedCharacters.concat(this.populateClass('WARRIOR', 2, 4, modifier))
                //wizard
                updatedCharacters = updatedCharacters.concat(this.populateClass('WIZARD', 1, 4, modifier))


                //npc classes
                //adepts
                updatedCharacters = updatedCharacters.concat(this.populateClass('ADEPT', 1, 6, modifier))
                //aristocrats
                updatedCharacters = updatedCharacters.concat(this.populateClass('ARISTOCRAT', 1, 4, modifier))
                //commoner
                updatedCharacters = updatedCharacters.concat(this.populateClass('COMMONER', 4, 4, modifier))
                //expert
                updatedCharacters = updatedCharacters.concat(this.populateClass('EXPERT', 3, 4, modifier))
                //warrior
                updatedCharacters = updatedCharacters.concat(this.populateClass('WARRIOR', 2, 4, modifier))


                let remaining = totalSize - updatedCharacters.length
                //make more level 1 characters
                //create .5% aristocrats
                for (let i = 0; i < remaining * .005; i++) {
                    updatedCharacters.push(this.createCharacter({ characterClass: "ARISTOCRAT" }))
                }

                //create .5% adepts
                for (let i = 0; i < remaining * .005; i++) {
                    updatedCharacters.push(this.createCharacter({ characterClass: "ADEPT" }))
                }
                //create 3% experts
                for (let i = 0; i < remaining * .03; i++) {
                    updatedCharacters.push(this.createCharacter({ characterClass: "EXPERT" }))
                }
                //create 5% warriors
                for (let i = 0; i < remaining * .05; i++) {
                    updatedCharacters.push(this.createCharacter({ characterClass: "WARRIOR" }))
                }
                //create the rest as commoners
                for (let i = 0; i < totalSize - updatedCharacters.length * .005; i++) {
                    updatedCharacters.push(this.createCharacter({ characterClass: "ARISTOCRAT" }))
                }
                console.log('generated characters', updatedCharacters.length)
                console.log('totalSize', totalSize)
                break
        }
        return updatedCharacters
    }

    private roll({ size = 20, count = 1, modifier = 0 }: { size?: number, count?: number, modifier?: number }) {
        let sum = modifier
        for (let i = 0; i < count; i++) {
            sum += Math.floor(Math.random() * (size + 1))
        }
        return sum
    }

    castSpell(casterId: string, spellName: string, targetIds: string[]) {

        //TODO
        //console.log('spellName', spellName)
        switch (spellName) {
            case 'DISINTEGRATE':
                //     console.log('targetIds', targetIds)
                const damagedTargets = this.gameWorld.getCharacters(targetIds).map((character) => {
                    const damage = this.roll({ size: 6, count: 2 })
                    character.hp = Math.max(-10, character.hp - damage)
                    return this.gameWorld.updateCharacter(character)

                })
                //TODO update the caster character too and return it
                return damagedTargets
            default:
                return []
        }
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

            //TODO pass the new speed to the location calculatin or not?
            let { newX, newY }: { newX: number; newY: number; } = this.calculatePosition({ ...character, }, dt);


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
        const currentModeMaxSpeed = character.maxSpeed * character.mode * Math.abs(character.speedAcceleration)
        const currentModeMinSpeed = -character.maxSpeed * character.mode * Math.abs(character.speedAcceleration)
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
                //if we started out going faster then currentModeMaxSpeed
                if (character.speed > currentModeMaxSpeed) {
                    //then don't slow down to less then the softmax
                    newSpeed = Math.max(currentModeMaxSpeed, character.speed + speedDelta)
                }
                //we started out going slower then currentModeMaxSpeed 
                else {
                    //then don't go faster then currentModeMaxSpeed
                    newSpeed = Math.min(currentModeMaxSpeed, character.speed + speedDelta)

                }
            }
            else if (character.speed < 0) {
                //accelerating forward while going backwards
                //don't let the character go faster then currentModeMaxSpeed
                newSpeed = Math.min(currentModeMaxSpeed, character.speed + speedDelta)
            }
        }
        //character is accelerating backward
        else {
            //character is already moving forward
            if (character.speed >= 0) {
                //accelerating backwards while moving forwards
                //don't let the character go slower then currentModeMinSpeed
                newSpeed = Math.max(currentModeMinSpeed, character.speed + speedDelta)
            }
            else if (character.speed < 0) {
                //accelerating backwards while moving backwards
                //character started out going backwards faster then currentModeMinSpeed
                if (character.speed < currentModeMinSpeed) {
                    //then don't slow down to less then currentModeMinSpeed
                    newSpeed = Math.min(currentModeMinSpeed, character.speed + speedDelta)
                }
                //accelerating backward while moving backward slower then currentModeMaxSpeed 
                else {
                    //then don't go faster then currentModeMinSpeed
                    newSpeed = Math.max(currentModeMinSpeed, character.speed + speedDelta)
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