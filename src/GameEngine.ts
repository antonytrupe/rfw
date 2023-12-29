import EventEmitter from "events"
import Character from "./types/Character"
import * as CONSTANTS from "./types/CONSTANTS"
import GameWorld from "./GameWorld"
import { clamp, roll } from "./utility"
import GameEvent from "./types/GameEvent"
import * as LEVELS from "./types/LEVELS.json"
import Point from "./types/Point"
import WorldObject from "./types/WorldObject"
import { SHAPE } from "./types/SHAPE"
import { polygonSlide, distanceBetweenPoints, getRotation, getRotationDelta } from "./Geometry"
import { LEFT, RIGHT } from "./types/CONSTANTS"
import { Actions, AttackAction } from "./types/Action"
//import { Engine, Body, Bodies, Constraint, Composite, World } from 'matter-js';

//processes game logic
//interacts with the gameworld object and updates it
//doesn't know anything about client/server
export default class GameEngine {

    //EventEmitter function
    //private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    private emit: (eventName: string | symbol, ...args: any[]) => boolean
    //data object
    gameWorld: GameWorld

    activeCharacters: Set<string> = new Set()

    private ticksPerSecond: number

    private lastTimestamp: DOMHighResTimeStamp | undefined
    //lower number means faster, higher means slower
    private accelerationMultiplier: number = 20
    //private rotationMultiplier: number = 1000 / Math.PI
    private rotationMultiplier: number = 500
    //1px/ft
    //5ft/s*1000ms/s
    //30ft/6seconds
    private speedMultiplier: number = 6000
    timeoutID: NodeJS.Timeout | undefined
    doGameLogic: boolean

    /**
     * 60 frames per second is one frame every ~17 milliseconds
     * 30 frames per second is one frame every ~33 milliseconds
     * @param param0 
     * @param eventEmitter 
     */
    constructor({ ticksPerSecond, doGameLogic = true }: { ticksPerSecond: number, doGameLogic?: boolean }, eventEmitter: EventEmitter) {
        this.gameWorld = new GameWorld()
        //this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        //this.eventNames = eventEmitter.eventNames.bind(eventEmitter)
        this.ticksPerSecond = ticksPerSecond
        this.doGameLogic = doGameLogic
    }

    getCharacters(ids: string[]) {
        return this.gameWorld.getCharacters(ids)
    }
    getObject(id: string): any {
        return this.gameWorld.getObject(id)
    }

    private takeDamage(character: Character, damage: number) {
        character = this.updateCharacter({ id: character.id, hp: clamp(character.hp - damage, -10, character.maxHp) }).getCharacter(character.id)!

        //todo if its unconcious
        if (character.hp <= 0) {
            //clear accelerations and all actions
            character = this.updateCharacter({ id: character.id, actions: [], rotationAcceleration: 0, speedAcceleration: 0 }).getCharacter(character.id)!
        }
        //if its deaddead
        if (character.hp <= -10) {
            //turn it into a tombstone
            //this.deleteCharacter(character.id)
            //this.updateTombstone(character)
        }
    }

    updateTombstone(character: Character) {
        throw new Error("Method not implemented.")
    }

    deleteCharacter(id: string) {
        throw new Error("Method not implemented.")
    }

    //this is the wrapper and callback function that calls step
    private tick() {
        const now = (new Date()).getTime()
        this.lastTimestamp = this.lastTimestamp || now
        const dt = now - this.lastTimestamp
        this.lastTimestamp = now
        this.step(dt, now)

        this.timeoutID = setTimeout(this.tick.bind(this), 1000 / this.ticksPerSecond)
    }

    //leave it public for testing
    step(dt: number, now: number): Set<string> {
        //console.log('GameEngine.step')
        const started = (new Date()).getTime()
        //Engine.update(this.engine, dt)

        //figure out if this is the first step of a new turn
        const lastTurn = Math.floor((now - dt) / 1000 / 6)
        const currentTurn = Math.floor(now / 1000 / 6)
        let newTurn = false
        if (lastTurn != currentTurn) {
            newTurn = true
        }
        //clients only need acceleration changes, they can keep calculating new locations themselves accurately
        const updatedCharacters: Set<string> = new Set()
        const gameEvents: GameEvent[] = []

        //TODO get them in initiative order
        //TODO put different initiatives at different ticks in the turn
        //console.log('active characters:', this.activeCharacters.size)
        this.activeCharacters.forEach((id) => {
            let character: Character = this.getCharacter(id)!

            if (newTurn) {
                character = this.updateCharacter({ id: character.id, actionsRemaining: 1 }).getCharacter(character.id)!
                if (character.actionsRemaining != 1) {
                    //client can do this reliably
                    //updatedCharacters.add(character.id)
                }
            }

            if (character.hp <= 0) {
                //we're dieing, stop trying to do things
                character = this.updateCharacter({
                    id: character.id,
                    speedAcceleration: 0,
                    rotationAcceleration: 0,
                    actions: [],
                    target: ''
                }).getCharacter(character.id)!
                //updatedCharacters.add(character.id)
            }

            //if below 0 hps and not dead 
            //TODO stable check
            if (character.hp < 0 && character.hp > -10 && newTurn) {
                //loose another hp
                this.updateCharacter({ id: character.id, hp: clamp(character.hp - 1, -10, character.hp) })
                //updatedCharacters.add(character.id)
            }

            if (character.actions.length > 0 && character.actionsRemaining > 0) {
                //console.log('doing an action')
                const action = character.actions[0]
                //combat
                //actions that are only done on the server(attack/damage)
                if (action.action == 'attack' && this.doGameLogic && !!action.targetId) {
                    //get the target
                    const target = this.getCharacter(action.targetId)
                    if (target && !!target.id) {
                        //if the target is dead already, stop attacking it
                        //TODO this might not belong here
                        if (target.hp <= -10) {
                            this.attackStop(character.id)
                            updatedCharacters.add(character.id)
                        }

                        //check range
                        const distance = distanceBetweenPoints(target.location, character.location)
                        if (distance <= (target.radiusX + character.radiusX) * 1.1) {
                            //console.log('distance', distance)
                            //always spend an action
                            character = this.updateCharacter({ id: character.id, actionsRemaining: character.actionsRemaining - 1 })
                                .getCharacter(character.id)!
                            //updatedCharacters.add(character.id)

                            //handle multiple attacks
                            character.bab.forEach((bab) => {
                                //roll for attack
                                const attack = roll({ size: 20, modifier: bab })
                                if (attack > 10) {
                                    //console.log('hit', attack)
                                    //roll for damage
                                    const damage = roll({ size: 6 })

                                    //update the target's hp, clamped to -10 and maxHp
                                    this.takeDamage(target, damage)
                                    updatedCharacters.add(target.id)
                                    //if the target was alive but now its dieing
                                    if (target.hp > 0 && target.hp <= damage) {
                                        //give xp
                                        character = this.updateCharacter({ id: character.id, xp: character.xp + this.calculateXp([], []) })
                                            .getCharacter(character.id)!
                                        updatedCharacters.add(character.id)
                                        //levelup check
                                        if (character.xp >= LEVELS[(character.level + 1).toString() as keyof typeof LEVELS]) {
                                            character = this.updateCharacter({ id: character.id, level: character.level + 1 })
                                                .getCharacter(character.id)!
                                            updatedCharacters.add(character.id)
                                        }
                                        //its(the target) (almost)dead, Jim
                                        //both characters stop attacking
                                        this.attackStop(character.id)
                                        updatedCharacters.add(character.id)

                                        //TODO this can probably go in a more general place when its the target's turn
                                        this.attackStop(target.id)
                                        updatedCharacters.add(target.id)
                                    }
                                    gameEvents.push({ target: target.id, type: 'attack', amount: damage, time: now })

                                }
                                else {
                                    //console.log('miss', attack)
                                    gameEvents.push({ target: target!.id, type: 'miss', amount: 0, time: now })
                                }
                            })
                            //done doing attacks
                            console.log('call for help')
                            //call for help 
                            if (action.triggerSocialAgro) {
                                const helper = this.recruitHelp(target, false)
                                updatedCharacters.add(helper.id)
                            }
                            if (!target.target) {
                                //fight back
                                const triggerSocialAgro = false
                                const triggerSocialAssist = true
                                this.attack(target.id, character.id, triggerSocialAgro, triggerSocialAssist)
                                updatedCharacters.add(target.id)
                            }
                        }
                        else {
                            //TODO too far away, but not every tick, like once a second or something maybe
                            //console.log('too far away', distance)
                            //gameEvents.push({ target: target.id, type: 'to_far_away', amount: 0, time: now })
                        }
                    }
                }
                else if (action.action == 'move' && !!action.location) {
                    const dist = distanceBetweenPoints(action.location, character.location)
                    let targetRotation
                    let turnRotation = 0
                    let speedAcceleration = 0
                    let actions = character.actions
                    if (dist > character.radiusX) {
                        //console.log('turn/accelerate/stop')
                        targetRotation = getRotation(character.location, action.location)

                        //turn right or left
                        turnRotation = this.calculateRotationAcceleration(character.rotation, targetRotation)

                        //accelerate or stop accelerating
                        speedAcceleration = this.calculateAcceleration(character, action.location)
                    }

                    //if the target is inside another character and we've collided, then stop trying to move any more
                    //check for collisions
                    let charactersAtTarget = this.gameWorld.getCharactersNearPoint({ location: action.location, distance: 5 })
                        //throw out the current character
                        //throw out dead characters
                        .filter((it) => { return it.id != character.id && it.hp > -10 })
                    if (charactersAtTarget.length > 0) {
                        //console.log('characters at target')
                        const dist = distanceBetweenPoints(character.location, charactersAtTarget[0].location)
                        if (dist < (character.radiusX + charactersAtTarget[0].radiusX)) {
                            //console.log('colliding with characters at target')
                            turnRotation = 0
                            speedAcceleration = 0
                        }
                    }

                    if (turnRotation == 0 && speedAcceleration == 0) {
                        //we got there, so clear all move actions
                        actions = actions.filter((action) => { return action.action != 'move' })
                    }

                    character = this.updateCharacter({
                        id: character.id,
                        rotationAcceleration: turnRotation,
                        speedAcceleration: speedAcceleration,
                        actions: actions
                    }).getCharacter(character.id)!

                    //updatedCharacters.add(character.id)
                }
            }

            //calculate the new angle
            let newRotation = this.calculateRotation(character, dt)

            //TODO if they went over their walk speed or they went over their walk distance, then consume an action
            //TODO if they don't have an action to use for running, don't let them run
            let newSpeed = this.calculateSpeed(character, dt)

            let newPosition = this.calculatePosition(character, dt)
            //check for collisions
            newPosition = this.slide(character, newPosition)

            this.updateCharacter({ id: character.id, location: newPosition, speed: newSpeed, rotation: newRotation })
            //if (newPosition?.x != character.location.x || newPosition.y != character.location.y || newSpeed != character.speed || newRotation != character.rotation) {
            //updatedCharacters.add(character.id)
            //}
        })

        if (updatedCharacters.size > 0) {
            //tell the server engine about the updated characters
            this.emit(CONSTANTS.SERVER_CHARACTER_UPDATE, updatedCharacters)
        }

        if (gameEvents.length > 0) {
            //tell the serverengine about the events
            this.emit(CONSTANTS.GAME_EVENTS, gameEvents)
        }

        const finished = (new Date()).getTime()
        if (finished - started > 5) {
            console.log('step duration', finished - started)
        }
        //return for testing convenience
        return updatedCharacters
    }

    private slide(character: Character, newPosition: Point): Point {
        let collisionObjects: WorldObject[] =
            //get world objects
            this.gameWorld.getObjectsInWay(character, newPosition)
                //filter out shapes we don't know how to handle yet
                .filter((o) => {
                    return true && [SHAPE.CIRCLE, SHAPE.RECT].includes(o.shape) && o.physics
                })
                //get characters
                .concat(
                    this.gameWorld.getCharactersNearSegment({ start: character.location, stop: newPosition, width: character.radiusX })
                        //filter out current character and dead characters
                        .filter((it) => { return it.id != character.id && it.hp > -10 })
                )
        if (collisionObjects.length > 0) {
            //"sum up" all the new positions from colliding objects
            const collisionSum = collisionObjects.reduce((previousValue, currentObject) => {
                let x = 0, y = 0
                if (currentObject.shape == SHAPE.CIRCLE) {
                    //get the rotation to the colliding object
                    const d = getRotation(currentObject.location, newPosition)

                    //get the distance along that path of both objects size/2
                    //aka push our character out of the circle via the closest direction
                    x = currentObject.location.x + Math.cos(d) * (character.radiusX + currentObject.radiusX)
                    y = currentObject.location.y - Math.sin(d) * (character.radiusX + currentObject.radiusX)
                }
                else if (currentObject.shape == SHAPE.RECT) {

                    const cp = polygonSlide(character, newPosition, currentObject)
                    //console.log('cp', cp)
                    if (!!cp) {
                        //console.log('using cp')

                        x = cp.x
                        y = cp.y
                    }
                    else {
                        console.log('cp is null or undefined')
                    }
                }

                previousValue.x += x
                previousValue.y += y
                return previousValue
            }, { x: 0, y: 0 })
            //then get the average position
            newPosition = { x: collisionSum.x / collisionObjects.length, y: collisionSum.y / collisionObjects.length }
        }
        return newPosition
    }

    private calculatePerpendicularPoint(rectangle: WorldObject, pointOnEdge: Point, distance: number): Point | null {
        const { location, width, height, rotation } = rectangle

        //Translate the point on the edge to the local coordinate system of the rotated rectangle
        const translatedPoint = {
            x: (pointOnEdge.x - location.x) * Math.cos(-rotation) - (pointOnEdge.y - location.y) * Math.sin(-rotation),
            y: (pointOnEdge.x - location.x) * Math.sin(-rotation) + (pointOnEdge.y - location.y) * Math.cos(-rotation),
        }

        //Check if the translated point is on the left or right edge of the rectangle
        const onLeftEdge = translatedPoint.x < -width / 2
        const onRightEdge = translatedPoint.x > width / 2

        //Check if the translated point is on the top or bottom edge of the rectangle
        const onTopEdge = translatedPoint.y < -height / 2
        const onBottomEdge = translatedPoint.y > height / 2

        //Calculate the direction vector along the edge
        let direction: Point

        if (onLeftEdge) {
            direction = { x: -1, y: 0 }
        } else if (onRightEdge) {
            direction = { x: 1, y: 0 }
        } else if (onTopEdge) {
            direction = { x: 0, y: -1 }
        } else if (onBottomEdge) {
            direction = { x: 0, y: 1 }
        } else {
            console.log('The point is not on any edge')
            return null //The point is not on any edge
        }

        //Normalize the direction vector
        const normalizedDirection = {
            x: direction.x / Math.sqrt(direction.x ** 2 + direction.y ** 2),
            y: direction.y / Math.sqrt(direction.x ** 2 + direction.y ** 2),
        }

        //Calculate the perpendicular point at the specified distance
        const perpendicularPoint = {
            x: location.x + translatedPoint.x + normalizedDirection.y * distance,
            y: location.y + translatedPoint.y - normalizedDirection.x * distance,
        }

        //Transform the perpendicular point back to the global coordinate system
        const globalPerpendicularPoint = {
            x: perpendicularPoint.x * Math.cos(rotation) - perpendicularPoint.y * Math.sin(rotation) + location.x,
            y: perpendicularPoint.x * Math.sin(rotation) + perpendicularPoint.y * Math.cos(rotation) + location.y,
        }

        return globalPerpendicularPoint
    }

    private recruitHelp(character: Character, triggerSocialAgro: boolean) {
        console.log('recruitHelp')
        //TODO figure out who the aggressor was 
        //call for help 
        //just get the nearest level character that's nearby to attack
        const nearby = this.gameWorld.getCharactersNearPoint({ location: character.location, distance: 60 })
            //get rid of the two already fighting
            .filter((it) => {
                return it.id != character.id && !character.targeters.includes(it.id) &&
                    //only characters still alive
                    it.hp > 0 &&
                    //only unclaimed characters
                    it.playerId == ''
            })
            //sort them by distance
            .sort((a, b) => {
                const distancetoA = distanceBetweenPoints(character.location, a.location)
                const distancetoB = distanceBetweenPoints(character.location, b.location)
                return distancetoA == distancetoB ? 0 : distancetoA > distancetoB ? 1 : -1
            })
        //console.log('nearby', nearby)
        const aggressor = this.getCharacter(character.targeters[0])
        const helper = nearby[0]
        if (!!aggressor && nearby.length > 0) {
            //console.log('aggressor', aggressor)
            console.log('found someone to help')
            //move first, then attack. order matters    
            this.moveCharacter(nearby[0].id, aggressor.location)
            this.attack(nearby[0].id, aggressor.id, triggerSocialAgro, false)
        }
        return helper
    }

    calculateAcceleration(character: Character, target: Point): number {
        const currentRotation = character.rotation
        const targetRotation = getRotation(character.location, target)
        const delta = getRotationDelta(currentRotation, targetRotation)

        let acceleration = 0

        //make this scale based on how close we are
        if (delta > -Math.PI / 2 && delta < Math.PI * 1 / 2)
            acceleration = 1
        else
            acceleration = 0

        //get our location in .6 seconds if we stopped accelerating now
        const loc = this.calculatePosition({ ...character, speedAcceleration: 0 }, 600)
        const dist = distanceBetweenPoints(target, loc)
        if (dist <= character.radiusX) {
            acceleration = 0
        }
        return acceleration
    }

    calculateRotationAcceleration(current: number, target: number) {
        let delta = getRotationDelta(current, target)
        //do something about creeping up on 0
        let a = clamp(delta / (Math.PI / 4), -1, 1)
        if (Math.abs(a) > .01 || a == 0)
            return a
        else
            return Math.abs(a) / a * .01
    }

    moveCharacter(characterId: string, location: Point) {
        //unconscious check
        const character = this.getCharacter(characterId)
        if (!character || character?.hp! <= 0) {
            return
        }
        //clear other move actions and add new move action
        //add the new action to the end or beginning?
        const actions: Actions = [{ action: 'move', location: location }, ...character.actions.filter((action) => { return action.action != 'move' })]

        this.updateCharacter({ id: characterId, actions: actions })
    }

    attackStop(attackerId: string): GameEngine {
        //TODO attacker owner check
        const attacker = this.getCharacter(attackerId)!
        const attackeeId = attacker?.target

        const actions = attacker.actions.filter((action) => { return action.action != 'attack' })
        this.updateCharacter({ id: attackerId, target: "", actions: actions })

        if (!!attackeeId) {
            let attackee = this.getCharacter(attackeeId)
            if (!!attackee) {
                const t = new Set(attackee.targeters)
                t.delete(attackerId)
                this.updateCharacter({ id: attackeeId, targeters: Array.from(t.values()) })
            }
        }
        return this
    }

    attack(attackerId: string, attackeeId: string, triggerSocialAgro: boolean, triggerSocialAssist: boolean): GameEngine {
        //TODO attacker owner check
        const attacker = this.getCharacter(attackerId)!
        const newAttackAction: AttackAction = { action: 'attack', targetId: attackeeId, triggerSocialAgro: triggerSocialAgro, triggerSocialAssist: triggerSocialAssist }
        const actions = [...attacker.actions.filter((action) => { return action.action != 'attack' }), newAttackAction]

        this.updateCharacter({ id: attackerId, target: attackeeId, actions: actions })
        if (attackeeId) {
            let attackee = this.getCharacter(attackeeId)
            if (!!attackee) {
                const t = new Set(attackee.targeters).add(attackerId)
                this.updateCharacter({ id: attackeeId, targeters: Array.from(t.values()) })
            }
        }
        else {

        }
        return this
    }

    getCharacter(characterId: string) {
        return this.gameWorld.getCharacter(characterId)
    }

    getZonesIn({ top, bottom, left, right }: { top: number, bottom: number, left: number, right: number }) {
        //TODO scale determines what kind of zones to use, not viewport, I think
        const area = (right - left) * (bottom - top)
        let zones = []
        if (area < 1000000) {
            //tactical zones
            for (let x = left; x < right; x += 30) {
                for (let y = top; y < bottom; y += 30) {
                    zones.push(this.gameWorld.getTacticalZoneName({ x: x, y: y }))
                }
            }
        }
        else {
            //TODO do local zone names
            for (let x = left; x < right; x += 300) {
                for (let y = top; y < bottom; y += 300) {
                    zones.push(this.gameWorld.getLocalZoneName({ x: x, y: y }))
                }
            }
        }
        return zones
    }

    /**
    * @param characterId 
     * @returns 
     */
    unClaimCharacter(characterId: string) {
        const character = this.getCharacter(characterId)
        if (!character) {
            return
        }
        return this.updateCharacter({ id: characterId, playerId: "" })
            .getCharacter(characterId)
    }

    /////////movement stuff///////
    accelerateDoubleStop(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        this.updateCharacter({ id: character.id, mode: 1 })
        return true
    }

    accelerateStop(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        this.updateCharacter({ id: character.id, speedAcceleration: 0 })
        return true
    }

    accelerateDouble(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        if (character?.hp! <= 0) {
            return false
        }
        if (character.mode == 2) {
            return false
        }
        //clear any move actions
        const actions = character.actions.filter((action) => { return action.action != 'move' })
        this.updateCharacter({ id: character.id, mode: 2, actions: actions })
        return true
    }

    turnStop(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        if (character.rotationAcceleration == 0) {
            return false
        }
        //clear any move actions
        const actions = character.actions.filter((action) => { return action.action != 'move' })
        this.updateCharacter({ id: character.id, rotationAcceleration: 0, actions: actions })
        return true
    }

    decelerate(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        if (character?.hp! <= 0) {
            return false
        }
        if (character.speedAcceleration == -1) {
            return false
        }
        //clear any move actions
        const actions = character.actions.filter((action) => { return action.action != 'move' })
        this.updateCharacter({ id: character.id, speedAcceleration: -1, actions: actions })
        return true
    }

    accelerate(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        if (character?.hp! <= 0) {
            return false
        }
        if (character.speedAcceleration == 1) {
            return false
        }
        //clear any move actions
        const actions = character.actions.filter((action) => { return action.action != 'move' })
        this.updateCharacter({ id: character.id, speedAcceleration: 1, actions: actions })
        return true
    }

    turnLeft(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        if (character?.hp! <= 0) {
            return false
        }
        if (character.rotationAcceleration == LEFT) {
            return false
        }
        //clear any move actions
        const actions = character.actions.filter((action) => { return action.action != 'move' })
        this.updateCharacter({ id: character.id, rotationAcceleration: LEFT, actions: actions })
        return true
    }

    turnRight(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        if (character?.hp! <= 0) {
            return false
        }
        if (character.rotationAcceleration == RIGHT) {
            return false
        }
        //clear any move actions
        const actions = character.actions.filter((action) => { return action.action != 'move' })
        this.updateCharacter({ id: character.id, rotationAcceleration: RIGHT, actions: actions })
        return true
    }

    updateCharacters(characters: Character[]): GameEngine {
        characters.forEach((character) => {
            this.updateCharacter(character)
        })
        return this
    }

    updateObjects(objects: WorldObject[]) {
        this.gameWorld.updateWorldObjects(objects)
    }

    updateCharacter(updates: Partial<Character>): GameEngine {

        const character = this.gameWorld.updateCharacter(updates)
            .getCharacter(updates.id)!

        //console.log(character)

        //check for things that make this an active character
        if (!!character && (
            //has any rotation acceleration
            character.rotationAcceleration != 0 ||
            //has any speed acceleration
            character.speedAcceleration != 0 ||
            //has any speed
            character.speed != 0 ||
            //has any actions
            character.actions?.length != 0 ||
            //dieing
            (character.hp <= 0 && character.hp > -10))
        ) {
            //console.log('activating', character.id)
            this.activeCharacters.add(character.id)
        }
        else if (!!character) {
            //console.log('deactivating', character.id)
            this.activeCharacters.delete(character.id)
        }
        return this
    }

    createCharacter(character: Partial<Character>): GameEngine {
        if (!character || !character.id) {
            return this
        }
        this.updateCharacter(character)
        return this
    }

    private shortRest(character: Character) {
        //TODO short rest
    }

    private longRest(character: Character) {
        //TODO long rest
    }

    castSpell(casterId: string, spellName: string, targetIds: string[]): (Character | undefined)[] {
        //console.log('spellName', spellName)
        switch (spellName) {
            case 'DISINTEGRATE':
                //console.log('targetIds', targetIds) 
                this.gameWorld.getCharacters(targetIds).map((character) => {
                    const damage = roll({ size: 6, count: 2 })
                    if (character) {
                        const hp = Math.max(-10, character.hp - damage)
                        const newLocal = this.updateCharacter({ id: character.id, hp: hp })
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

    private calculateXp(party: Character[], monsters: Character[]) {
        //TODO calculate xp
        return 500
    }

    private calculateSpeed(character: Character, dt: number) {
        let newSpeed = 0
        //soft caps might be the same as hard caps
        //if mode or acceleration are 0 then the soft caps get pushed to 0
        const currentModeMaxSpeed = character.maxSpeed * character.mode * Math.abs(character.speedAcceleration)
        const currentModeMinSpeed = -character.maxSpeed * character.mode * Math.abs(character.speedAcceleration)
        let mode = character.mode

        let outsideSoftCaps = currentModeMinSpeed > character.speed || character.speed > currentModeMaxSpeed
        //console.log('outsideSoftCaps', outsideSoftCaps)
        let accel = character.speedAcceleration
        //if we're outside soft caps or acceleration is 0 and we're moving
        if (outsideSoftCaps || (character.speedAcceleration == 0 && character.speed != 0)) {
            //console.log('forcing sprinting')
            //force sprinting
            mode = 2
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
        let speedDelta = accel * mode * dt / this.accelerationMultiplier
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
        newSpeed = Math.max(hardMin, Math.min(newSpeed, hardMax))
        //if we started inside the softcaps
        if (!outsideSoftCaps) {
            //then stay capped to them
            newSpeed = Math.max(currentModeMinSpeed, Math.min(newSpeed, currentModeMaxSpeed))
        }
        else {
            //if we started outside the softcaps
        }
        return newSpeed
    }

    private calculateRotation(character: Character, dt: number) {
        let newAngle = character.rotation
        if (character.rotationAcceleration != 0) {
            newAngle = character.rotation + character.rotationAcceleration * dt / this.rotationMultiplier
        }
        //normalize it to between -2pi and 2pi
        newAngle %= (Math.PI * 2)
        //normalize it to 0 to 4pi
        newAngle += Math.PI * 2
        //normalize to 0 to 2pi
        newAngle %= (Math.PI * 2)
        return newAngle
    }

    private calculatePosition(character: Character, dt: number) {

        //r = v ^ 2 / g * sin(2θ)
        //const distanceTraveled = character.speed * dt / this.speedMultiplier
        //const angleInRadians = getRotationDelta(character.rotation, this.calculateRotation(character, dt))
        //const radius = distanceTraveled / angleInRadians;
        //console.log('radius', radius)


        const w = character.rotationAcceleration / this.rotationMultiplier
        let x: number = character.location.x
        let y: number = character.location.y
        if (character.speed != 0) {
            //calculate new position
            x = character.location.x + character.speed * (Math.cos(character.rotation + w * dt)) * dt / this.speedMultiplier
            y = character.location.y - character.speed * (Math.sin(character.rotation + w * dt)) * dt / this.speedMultiplier
        }
        return { x, y }
    }

    start() {
        this.timeoutID = setTimeout(this.tick.bind(this))
        return this
    }

    restart() {
        this.stop()
        this.gameWorld.restart()
        this.start()
    }

    stop() {
        clearTimeout(this.timeoutID)
    }
}