import EventEmitter from "events";
import Character from "./Character";
import * as CONSTANTS from "./CONSTANTS";
import GameWorld, { Zone, Zones } from "./GameWorld";
import isEqual from 'lodash.isequal';
import { roll } from "./utility";

//processes game logic
//interacts with the gameworld object and updates it
//doesn't know anything about client/server
export default class GameEngine {  
    //EventEmitter function
    private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    private emit: (eventName: string | symbol, ...args: any[]) => boolean;
    private eventNames: () => (string | symbol)[];
    //data object
    gameWorld: GameWorld

    private ticksPerSecond: number

    private lastTimestamp: DOMHighResTimeStamp | undefined
    //lower number means faster, higher means slower
    private accelerationMultiplier: number = 20
    private turnMultiplier: number = 1000 / Math.PI
    //1px/ft
    //5ft/s*1000ms/s
    //30ft/6seconds
    private speedMultiplier: number = 6000

    /**
     * 
     * @param param0 
     * @param eventEmitter 
     */
    constructor({ ticksPerSecond }: { ticksPerSecond: number }, eventEmitter: EventEmitter) {
        this.gameWorld = new GameWorld()
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.eventNames = eventEmitter.eventNames.bind(eventEmitter)
        this.ticksPerSecond = ticksPerSecond
    }

    getCharacter(characterId: string) {
        return this.gameWorld.getCharacter(characterId)
    }

    accelerateDoubleStop(characters: Character[]) {
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, mode: 1 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    accelerateStop(characters: Character[]) {
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 0 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    accelerateDouble(characters: Character[]) {
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, mode: 2 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    getZonesIn({ top, bottom, left, right }: { top: number, bottom: number, left: number, right: number }) {
        let zones = []
        for (let i = left; i < right; i += 30) {
            for (let j = top; j < bottom; j += 30) {
                zones.push(this.gameWorld.getTacticalZoneName({ x: i, y: j }))
            }
        }
        return zones
    }

    turnStop(characters: Character[]) {
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 0 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    /**
     * 
     * @param characterId 
     * @param playerId 
     * @returns a tuple who's first item is a list that contains the claimed character if claimed, otherwise an empty list
     */
    claimCharacter(characterId: string, playerId: string): [Character[], Zones] {
        const [character, zones] = this.gameWorld.updateCharacter({ id: characterId, playerId: playerId });
        if (character) {
            return [[character], zones]
        }
        return [[], new Map()]
    }

    decelerate(characters: Character[]) {
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: -1 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    accelerate(characters: Character[]) {
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 1 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    /**
     * 
     * @param characters list of characters to turn left
     * @returns updated characters. empty array if no characters updated
     */
    turnLeft(characters: Character[]): Character[] {
        //TODO only allowed to control claimed characters
        //  only return characters that were updated
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 1 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    /**
     * 
     * @param characters 
     * @returns a list of characters
     */
    turnRight(characters: Character[]): Character[] {
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: -1 })
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    updateCharacters(characters: Character[]): Character[] {
        // console.log(characters)
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter(character)
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    createCharacter(character: Partial<Character>): [Character[], Zones] {
        let maxHp = Math.max(1, Math.floor(Math.random() * 5) - 1)

        const merged = { ...character, size: 5, maxHp: maxHp, hp: maxHp };

        const [c, zones] = this.gameWorld.updateCharacter(merged)
        if (c) {
            return [[c], zones]
        }
        return [[], zones]
    }

    castSpell(casterId: string, spellName: string, targetIds: string[]): (Character | undefined)[] {
        //console.log('spellName', spellName)
        switch (spellName) {
            case 'DISINTEGRATE':
                // console.log('targetIds', targetIds) 
                const damagedTargets = this.gameWorld.getCharacters(targetIds).map((character) => {
                    const damage = roll({ size: 6, count: 2 })
                    if (character) {
                        const hp = Math.max(-10, character.hp - damage)
                        const newLocal = this.gameWorld.updateCharacter({ id: character.id, hp: hp });
                        //this is dumb
                        return newLocal
                    }
                })
                //TODO update the caster character too and return it
                return []
            default:
                return []
        }
    }

    //this is the wrapper and callback function that calls step
    private tick() {
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
        const started = (new Date()).getTime()
        //console.log('GameEngine.step')

        //TODO keep track of characters that have their direction and speed acceleration changed separately from their position changed
        //clients only need acceleration changes, they can keep calculating new locations themselves accurately
        const updatedCharacters: Character[] = []

        Array.from(this.gameWorld.getAllCharacters().values())
            .map((character: Character): Character => {

                //calculate the new angle
                let newDirection = this.calculateDirection(character, dt);

                let newSpeed = this.calculateSpeed(character, dt);

                //TODO pass the new speed to the location calculatin or not?
                let newPosition: { x: number, y: number } = this.calculatePosition(character, dt);

                const updates = { ...character, ...newPosition, speed: newSpeed, direction: newDirection }
                //  compare the values and see if they are different at all
                if (!isEqual(updates, character)) {
                    updatedCharacters.push({ ...character, ...newPosition, speed: newSpeed, direction: newDirection })
                }

                return updates
            })

        if (updatedCharacters.length > 0) {
            //update the gameworld state 
            this.gameWorld.updateCharacters(updatedCharacters)
            updatedCharacters.forEach((character: Character) => {
                this.gameWorld.updateCharacter(character)
            })

            //tell the server engine about the updated characters
            this.emit(CONSTANTS.SERVER_CHARACTER_UPDATE, updatedCharacters)
        }
        const finished = (new Date()).getTime()
        // console.log('step duration', finished - started)
        return updatedCharacters
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
        let x: number = character.x;
        let y: number = character.y;
        if (character.speed != 0) {
            //calculate new position
            x = character.x + character.speed * Math.sin(character.direction) * dt / this.speedMultiplier;
            y = character.y - character.speed * Math.cos(character.direction) * dt / this.speedMultiplier;
        }
        return { x, y };
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