import EventEmitter from "events";
import Character from "./Character";
import * as CONSTANTS from "./CONSTANTS";
import GameWorld, { Zones } from "./GameWorld";
import isEqual from 'lodash.isequal';
import { roll } from "./utility";
import { GameEvent } from "./ClientEngine";

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
    timeoutID: NodeJS.Timeout | undefined
    doGameLogic: boolean

    /**
     * 
     * @param param0 
     * @param eventEmitter 
     */
    constructor({ ticksPerSecond, doGameLogic = true }: { ticksPerSecond: number, doGameLogic?: boolean }, eventEmitter: EventEmitter) {
        this.gameWorld = new GameWorld()
        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.eventNames = eventEmitter.eventNames.bind(eventEmitter)
        this.ticksPerSecond = ticksPerSecond
        this.doGameLogic = doGameLogic
    }

    attack(attacker: string, attackee: string): Character | undefined {
        //TODO attacker owner check
        //console.log('gameengine.attack')
        //console.log('attacker',attacker)
        const [c,] = this.updateCharacter({ id: attacker, target: attackee, actions: [{ action: 'attack', target: attackee }] })
        //console.log(c)
        return c
    }

    getCharacter(characterId: string | undefined) {
        return this.gameWorld.getCharacter(characterId)
    }

    accelerateDoubleStop(character: Character, playerId: string | undefined) {
        if (character.playerId != playerId) {
            return
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, mode: 1 })
        return c
    }

    accelerateStop(character: Character, playerId: string | undefined) {
        if (character.playerId != playerId) {
            return
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 0 })
        return c
    }

    accelerateDouble(character: Character, playerId: string | undefined) {
        if (character.playerId != playerId) {
            return
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, mode: 2 })
        return c
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

    turnStop(character: Character, playerId: string | undefined) {
        if (character.playerId != playerId) {
            return
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 0 })
        return c
    }

    /**
     * 
     * @param characterId 
     * @param playerId 
     * @returns 
     */
    claimCharacter(characterId: string, playerId: string | undefined): Character | undefined {
        const [character,] = this.gameWorld.updateCharacter({ id: characterId, playerId: playerId });
        if (character) {
            return character
        }
        return undefined
    }

    unClaimCharacter(characterId: string) {
        const [character,] = this.gameWorld.updateCharacter({ id: characterId, playerId: "" });
        if (character) {
            return character
        }
        return undefined
    }

    decelerate(character: Character, playerId: string | undefined) {
        if (character.playerId != playerId) {
            return
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: -1 })
        return c
    }

    accelerate(character: Character, playerId: string | undefined) {
        if (character.playerId != playerId) {
            return
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, speedAcceleration: 1 })
        return c
    }

    /**
     * 
     * @param characters list of characters to turn left
     * @returns updated characters. empty array if no characters updated
     */
    turnLeft(character: Character, playerId: string | undefined): Character | undefined {
        if (character.playerId != playerId) {
            return undefined
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: 1 })
        return c
    }

    /**
     * 
     * @param characters 
     * @returns a list of characters
     */
    turnRight(character: Character, playerId: string | undefined): Character | undefined {
        if (character.playerId != playerId) {
            return undefined
        }
        const [c,] = this.gameWorld.updateCharacter({ id: character.id, directionAcceleration: -1 })
        return c
    }

    updateCharacters(characters: Character[]): Character[] {
        //console.log(characters)
        let updatedCharacters: Character[] = []
        characters.forEach((character) => {
            const [c,] = this.gameWorld.updateCharacter(character)
            if (c) {
                updatedCharacters.push(c)
            }
        })
        return updatedCharacters
    }

    updateCharacter(character: Partial<Character>) {
        return this.gameWorld.updateCharacter(character)
    }

    createCharacter(character: Partial<Character>): [Character[], Zones] {
        //TODO does this belong in gameengine or serverengine or both?
        let maxHp = roll({ modifier: 0 })

        const merged = { size: 5, maxHp: maxHp, hp: maxHp, ...character };

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
                //console.log('targetIds', targetIds) 
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
        this.step(dt, now)

        //60 frames per second is one frame every ~17 milliseconds
        //30 frames per second is one frame every ~33 milliseconds
        this.timeoutID = setTimeout(this.tick.bind(this), 1000 / this.ticksPerSecond);
    }

    private calculateXp(a:Character[],b:Character[]){
        //TODO calculate xp
    }

    //leave it public for testing
    step(dt: number, now: number) {
        //  figure out if this is the first step of a new turn
        const lastTurn = Math.floor((now - dt) / 1000 / 6)
        const currentTurn = Math.floor(now / 1000 / 6)
        let newTurn = false
        if (lastTurn != currentTurn) {
            //console.log('new turn', currentTurn)
            newTurn = true
        }
        const started = (new Date()).getTime()
        //console.log('GameEngine.step')

        //TODO keep track of characters that have their direction and speed acceleration changed separately from their position changed
        //clients only need acceleration changes, they can keep calculating new locations themselves accurately
        const updatedCharacters: Character[] = []
        const gameEvents: GameEvent[] = []

        //TODO get them in initiative order
        Array.from(this.gameWorld.getAllCharacters().values())
            .forEach((character: Character) => {
                if (newTurn) {
                    character.actionsRemaining = 1
                }
                //TODO calculate position and angle all at once
                //calculate the new angle
                let newDirection = this.calculateDirection(character, dt);

                let newSpeed = this.calculateSpeed(character, dt);

                //TODO pass the new speed to the location calculatin or not?
                let newPosition: { x: number, y: number } = this.calculatePosition(character, dt);

                const updates = { ...character, ...newPosition, speed: newSpeed, direction: newDirection }

                //actions that are only done on the server(attack/damage)
                //TODO put different initiatives at different ticks in the turn
                if (character.actions.length > 0 && character.actionsRemaining > 0 && this.doGameLogic) {
                    //console.log('doing an action')
                    const action = character.actions[0]
                    //combat
                    if (action.action == 'attack' && action.target) {
                        //get the target
                        let target = this.getCharacter(action.target)
                        if (target && target.id) {
                            //check range
                            const distance = this.getDistance({ x: target.x, y: target.y }, { x: character.x, y: character.y })
                            if (distance <= 5 + 0.5) {
                                //console.log('distance', distance)
                                //always spend an action
                                updates.actionsRemaining = character.actionsRemaining - 1
                                //handle multiple attacks
                                character.bab.forEach((bab) => {
                                    //roll for attack
                                    const attack = roll({ size: 20, modifier: bab })
                                    if (attack > 10) {
                                        //console.log('hit', attack)
                                        //roll for damage
                                        const damage = roll({ size: 6 });

                                        //update the target
                                        [target,] = this.updateCharacter({ id: target!.id, hp: target!.hp - damage })

                                        updatedCharacters.push(target!)
                                        gameEvents.push({ target: target!.id, type: 'attack', amount: damage, time: now })

                                    }
                                    else {
                                        //console.log('miss', attack)
                                        gameEvents.push({ target: target!.id, type: 'miss', amount: 0, time: now })
                                    }
                                })
                                //fight back
                                if (!target.target) {
                                    console.log('start fighting back')
                                    this.attack(target.id, character.id)
                                }
                            }
                            else {
                                //TODO too far away, but not every tick, like once a second or something maybe
                                //console.log('too far away', distance)
                                //gameEvents.push({ target: target.id, type: 'to_far_away', amount: 0, time: now })
                            }
                        }
                    }
                }

                //compare the values and see if they are different at all
                if (!isEqual(updates, character)) {
                    updatedCharacters.push({ ...character, ...updates })
                }

                //return updates
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

        if (gameEvents.length > 0) {
            //tell the serverengine about the events
            this.emit(CONSTANTS.GAME_EVENTS, gameEvents)
        }

        const finished = (new Date()).getTime()
        //console.log('step duration', finished - started)
        //return for testing convenience
        return updatedCharacters
    }

    getDistance(p1: { x: number; y: number; }, p2: { x: number; y: number; }) {
        const deltaX = p2.x - p1.x;
        const deltaY = p2.y - p1.y;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        return distance;
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
        //console.log('outsideSoftCaps', outsideSoftCaps)
        let accel = character.speedAcceleration
        //if we're outside soft caps or acceleration is 0 and we're moving
        if (outsideSoftCaps || (character.speedAcceleration == 0 && character.speed != 0)) {
            //console.log('forcing sprinting')
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
        //console.log('speedDelta', speedDelta)

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
        //console.log('hardMax', hardMax)
        //console.log('hardMin', hardMin)
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
        this.timeoutID = setTimeout(this.tick.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function') {
            //window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
        return this;
    }

    stop() {
        clearTimeout(this.timeoutID)
    }
}