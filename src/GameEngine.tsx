"use client"
import EventEmitter from "events";
import Character from "./Character";
import * as CONSTANTS from "./CONSTANTS";
import GameWorld, { Zones } from "./GameWorld";
import { v4 as uuidv4 } from 'uuid';
import isEqual from 'lodash.isequal';

//processes game logic
//interacts with the gameworld object and updates it
//doesn't know anything about client/server
export default class GameEngine {
    getZonesIn({ top, bottom, left, right }: { top: number, bottom: number, left: number, right: number }) {
        let zones = []
        for (let i = left; i < right; i += 30) {
            for (let j = top; j < bottom; j += 30) {
                zones.push(this.gameWorld.getTacticalZoneName({ x: i, y: j }))

            }
        }
        return zones
    }
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


    }

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

    createCharacter(character: Partial<Character>): [Character, Zones] {
        const id = uuidv4();
        let maxHp = Math.max(1, Math.floor(Math.random() * 5) - 1)

        //this is dumb
        const merged = { ...character, id: id, size: 5, maxHp: maxHp, hp: maxHp };
        const p = new Character(merged)
        const [c, zones] = this.gameWorld.updateCharacter(merged)
        return [p, zones]
    }

    private getRandomPoint({ origin: { x, y }, radius }: { origin: { x: number, y: number }, radius: number }) {
        const direction = Math.random() * Math.PI * 2
        const r = Math.random() * radius
        x = r * Math.cos(direction) + x
        y = r * Math.sin(direction) + y
        return { x, y }
    }

    private populateClass({ className, diceCount, diceSize, modifier, origin, radius }:
        { className: string, diceCount: number, diceSize: number, modifier: number, origin: { x: number, y: number }, radius: number })
        : [Character[], Zones] {
        let { x, y } = this.getRandomPoint({ origin, radius })
        const updatedCharacters: Character[] = []
        let updatedZones = new Map<string, Set<string>>()
        const highestLevel = this.roll({ size: diceSize, count: diceCount, modifier: modifier })
        // work our way down from highest level
        for (let level = highestLevel; level >= 1; level /= 2) {
            //console.log('level', level);
            //make the right amount of each level
            for (let i = 0; i < highestLevel / level; i++) {
                const [c, zones] = this.createCharacter({ characterClass: className, level: Math.round(level), x: x, y: y })
                updatedCharacters.push(c)
                updatedZones = new Map([...updatedZones, ...zones])
            }
        }
        return [updatedCharacters, updatedZones]
    }

    createCommunity({ size, race, location }: { size: string, race: string, location: { x: number, y: number } }): [Character[], Zones] {
        // console.log('createCommunity')
        let updatedCharacters: Character[] = []
        let updatedZones: Zones = new Map<string, Set<string>>()
        let modifier = -16
        let totalSize = 0

        let radius = 90

        switch (size) {
            case "THORP":
                modifier = -3
                totalSize = this.roll({ size: 60, modifier: 20 })
                break
            case "HAMLET":
                modifier = -2
                totalSize = this.roll({ size: 320, modifier: 80 })
                radius = 200
                break
            case "VILLAGE":
                modifier = -1
                totalSize = this.roll({ size: 500, modifier: 400 })
                radius = 300
                break
            case "SMALL_TOWN":
                modifier = 0
                totalSize = this.roll({ size: 1100, modifier: 900 })
                radius = 500
                break
            case "LARGE_TOWN":
                modifier = 3
                totalSize = this.roll({ size: 3000, modifier: 2000 })
                radius = 800
                break
            case "SMALL_CITY":
                modifier = 6
                totalSize = this.roll({ size: 7000, modifier: 5000 })
                radius = 1100
                break
            case "LARGE_CITY":
                modifier = 9
                totalSize = this.roll({ size: 13000, modifier: 12000 })
                radius = 1600
                break
            case "METROPOLIS":
                modifier = 12
                totalSize = this.roll({ size: 75000, modifier: 25000 })
                radius = 3200
                break
        }

        //pc classes
        //barbarians

        let [characters, zones] = this.populateClass({
            className: 'BARBARIAN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //bards
        [characters, zones] = this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //clerics

        [characters, zones] = this.populateClass({
            className: 'BARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //druid

        [characters, zones] = this.populateClass({
            className: 'DRUID',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //fighter 
        [characters, zones] = this.populateClass({
            className: 'FIGHTER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //monk 
        [characters, zones] = this.populateClass({
            className: 'MONK',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //paladin 
        [characters, zones] = this.populateClass({
            className: 'PALADIN',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //ranger 
        [characters, zones] = this.populateClass({
            className: 'RANGER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //rogue 
        [characters, zones] = this.populateClass({
            className: 'ROGUE',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //sorcerer 
        [characters, zones] = this.populateClass({
            className: 'SORCERER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //warrior 
        [characters, zones] = this.populateClass({
            className: 'WARRIOR',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //wizard 
        [characters, zones] = this.populateClass({
            className: 'WIZARD',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);


        //npc classes
        //adepts  
        [characters, zones] = this.populateClass({
            className: 'ADEPT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //aristocrats 
        [characters, zones] = this.populateClass({
            className: 'ARISTOCRAT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //commoner 
        [characters, zones] = this.populateClass({
            className: 'COMMONER',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        })
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //expert 
        [characters, zones] = this.populateClass({
            className: 'EXPERT',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        });
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        //warrior
        [characters, zones] = this.populateClass({
            className: 'WARRIOR',
            diceCount: 2, diceSize: 4, modifier: modifier,
            origin: location, radius: radius
        });
        updatedCharacters = updatedCharacters.concat(characters)
        updatedZones = new Map([...updatedZones, ...zones]);

        let remaining = totalSize - updatedCharacters.length
        //make more level 1 characters
        //create .5% aristocrats
        for (let i = 0; i < remaining * .005; i++) {
            let p = this.getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "ARISTOCRAT", x: p.x, y: p.y });
            updatedCharacters.push(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }

        //create .5% adepts
        for (let i = 0; i < remaining * .005; i++) {
            let p = this.getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "ADEPT", x: p.x, y: p.y });
            updatedCharacters.push(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }
        //create 3% experts
        for (let i = 0; i < remaining * .03; i++) {
            let p = this.getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "EXPERT", x: p.x, y: p.y });
            updatedCharacters.push(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }
        //create 5% warriors
        for (let i = 0; i < remaining * .05; i++) {
            let p = this.getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "WARRIOR", x: p.x, y: p.y });
            updatedCharacters.push(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }

        //create the rest as commoners
        for (let i = 0; updatedCharacters.length < totalSize; i++) {
            let p = this.getRandomPoint({ origin: location, radius })
            const [c, zones] = this.createCharacter({ characterClass: "COMMONER", x: p.x, y: p.y });
            updatedCharacters.push(c)
            updatedZones = new Map([...updatedZones, ...zones]);
        }

        return [updatedCharacters, updatedZones]
    }

    roll({ size = 20, count = 1, modifier = 0 }: { size?: number, count?: number, modifier?: number }) {
        let sum = modifier
        for (let i = 0; i < count; i++) {
            sum += Math.floor(Math.random() * (size + 1))
        }
        return sum
    }

    castSpell(casterId: string, spellName: string, targetIds: string[]) {
         //console.log('spellName', spellName)
        switch (spellName) {
            case 'DISINTEGRATE':
                // console.log('targetIds', targetIds) 
                const damagedTargets = this.gameWorld.getCharacters(targetIds).map((character) => {
                    const damage = this.roll({ size: 6, count: 2 })
                    if (character) {
                        character.hp = Math.max(-10, character.hp - damage)
                        return this.gameWorld.updateCharacter(character)
                    }
                })
                //TODO update the caster character too and return it
                return damagedTargets
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