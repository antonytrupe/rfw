import EventEmitter from "events"
import Character, { CharacterInterface } from "./types/Character"
import * as CONSTANTS from "./types/CONSTANTS"
import GameWorld from "./GameWorld"
import { roll } from "./utility"
import Point from "./types/Point"
import WorldObject from "./types/WorldObject"
import { SHAPE } from "./types/SHAPE"
import { polygonSlide, distanceBetweenPoints, getRotation, getRotationDelta, calculateRotationAcceleration } from "./Geometry"
import { LEFT, RIGHT } from "./types/CONSTANTS"
import { CONTINUOUS, ForageAction } from "./types/actions/Action"
import { quests } from "./types/Quest"
import AttackAction from "./types/actions/AttackAction"
import MoveToAction from "./types/actions/MoveToAction"
import MoveAction from "./types/actions/MoveAction"
import ExhaustionAction from "./types/actions/ExhaustionAction"

interface ZoneInfo {
    name: string
    x: number
    y: number
    width: number
}

//processes game logic
//interacts with the gameworld object and updates it
//doesn't know anything about client/server
export default class GameEngine {
    removeActiveCharacter(turn: number, id: string) {
        this.activeCharacters.get(turn)?.delete(id)
    }

    getActiveCharacters() {
        return this.activeCharacters
    }

    //EventEmitter function
    //private on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter
    private emit: (eventName: string | symbol, ...args: any[]) => boolean
    //data object
    gameWorld: GameWorld

    private activeCharacters: Map<number, Set<string>> = new Map()

    private fps: number

    private lastTime: number | undefined
    //lower number means faster, higher means slower
    private accelerationMultiplier: number = 20
    //private rotationMultiplier: number = 1000 / Math.PI
    private rotationMultiplier: number = 500
    //1px/ft
    //5ft/s*1000ms/s
    //30ft/6seconds
    private speedMultiplier: number = 6000
    private timeoutID: NodeJS.Timeout | undefined
    //private doGameLogic: boolean
    //private quests = quests
    createTime = new Date().getTime()
    currentTurn: number = 0

    /**
     * 60 frames per second is one frame every ~17 milliseconds
     * 30 frames per second is one frame every ~33 milliseconds
     */
    constructor({ fps, doGameLogic = true }: { fps: number, doGameLogic?: boolean }, eventEmitter: EventEmitter) {
        this.gameWorld = new GameWorld()
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.fps = fps
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
        console.log('stopping game engine')
        clearTimeout(this.timeoutID)
    }

    //this is the wrapper and callback function that calls step
    private tick() {
        const now = new Date().getTime()
        this.lastTime = this.lastTime || now
        const dt = now - this.lastTime
        this.lastTime = now
        this.step(dt, now)
        //console.log('this.ticksPerSecond', this.ticksPerSecond)
        this.timeoutID = setTimeout(this.tick.bind(this), 1000 / this.fps)

        this.addFrame(dt)
        //console.log('average FPS', this.getAverageFPS().toFixed(1))
        //console.log('FPS', 1000/dt)
        if (dt > (1000 / this.fps) * 1.6) {
            //console.log('long tick dt', dt)
        }
    }

    //leave it public for testing
    step(dt: number, now: number): Set<string> {
        //console.log(this.activeCharacters)
        //console.log(this.getCharacter('one').actions)
        //console.log('GameEngine.step')
        const started = now


        //createTime 9000ms
        //now        11000ms
        //now-create time 11000-9000=2000
        // 2000/1000

        //figure out if this is the first step of a new turn
        const lastTurn = Math.floor(((now - this.createTime) - dt) / 1000 / 6)
        this.currentTurn = Math.floor((now - this.createTime) / 1000 / 6)
        let newTurn = false
        if (lastTurn != this.currentTurn) {
            newTurn = true
            console.log('turn number', this.currentTurn)
            if (lastTurn + 1 != this.currentTurn) {
                console.log(`missed turns between ${lastTurn} and ${this.currentTurn}`)
            }
        }

        //clients only need acceleration changes, they can keep calculating new locations themselves accurately
        const updatedCharacters: Set<string> = new Set()

        //TODO get them in initiative order
        //TODO put different initiatives at different ticks in the turn?
        //console.log('active characters:', this.activeCharacters.size)

        //, ...this.activeCharacters.get(0) || []


        const turns = new Set(Array.from({ length: this.currentTurn - lastTurn + 1 }, (_, a) => a + lastTurn))
        turns.add(CONTINUOUS)
        //console.log(turns)

        turns.forEach((turn) => {

            this.activeCharacters.get(turn)?.forEach((id) => {

                let character: Character = this.getCharacter(id)

                if (newTurn) {
                    character = this.updateCharacter({ id: character.id, actionsRemaining: 1 }).getCharacter(character.id)
                    if (character.actionsRemaining != 1) {
                        //client can do this reliably
                        //updatedCharacters.add(character.id)
                    }
                }

                //TODO make dieing in step an action
                if (character.hp <= 0) {
                    //we're dieing, stop trying to do things
                    character = this.updateCharacter({
                        id: character.id,
                        //speedAcceleration: 0,
                        //rotationAcceleration: 0,
                        actions: [],
                        target: ''
                    }).getCharacter(character.id)
                    //updatedCharacters.add(character.id)
                }

                //console.log('step for', character.name)

                character.doActions({ engine: this, dt, now })


            })

        })

        if (updatedCharacters.size > 0) {
            //tell the server engine about the updated characters
            this.emit(CONSTANTS.SERVER_CHARACTER_UPDATE, updatedCharacters)
        }

        const finished = (new Date()).getTime()
        if (finished - started > 5) {
            console.log('step duration', finished - started)
        }
        //return for testing convenience
        return updatedCharacters
    }

    getCharactersIntoZones(zones: Set<string>): Character[] {
        return this.gameWorld.getCharactersInZones(zones)
    }

    getCharacters(ids: string[]) {
        return this.gameWorld.getCharacters(ids)
    }

    getAllCharacters() {
        return this.gameWorld.getAllCharacters()
    }

    getObject(id: string): any {
        return this.gameWorld.getObject(id)
    }

    updateTombstone(character: Character) {
        throw new Error("Method not implemented.")
    }

    deleteCharacter(characterId: string) {
        //TODO find all the turns this character has actions queued for
        this.activeCharacters.get(0).delete(characterId)
        this.gameWorld.deleteCharacter(characterId)
    }

    deleteCharacters(characterIds: string[]) {
        characterIds.forEach((id) => this.deleteCharacter(id))
    }

    private frameTimes: number[] = []

    getAverageFPS(): number {
        if (this.frameTimes.length === 0) {
            return 0;
        }
        const total = this.frameTimes.reduce((acc, fps) => acc + fps, 0);
        return 1000 / (total / this.frameTimes.length);
    }

    addFrame(dt: number) {
        this.frameTimes.push(dt)
        if (this.frameTimes.length > 1000) {
            this.frameTimes.splice(0, 1)
        }
    }

    slide(character: Character, newPosition: Point): Point {
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

    recruitHelp(character: Character, triggerSocialAgro: boolean) {
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
            this.addMoveToAction(nearby[0].id, aggressor.location)
            this.addAttackAction(nearby[0].id, aggressor.id, triggerSocialAgro, false)
        }
        return helper
    }

    calculateAcceleration(character: Character, action: MoveAction, target: Point): number {
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
        const loc = this.calculatePosition(character, action, 600)
        const dist = distanceBetweenPoints(target, loc)
        if (dist <= character.radiusX) {
            acceleration = 0
        }
        return acceleration
    }

    removeAttackAction(attackerId: string): GameEngine {
        //TODO attacker owner check
        const attacker = this.getCharacter(attackerId)!
        const attackeeId = attacker?.target

        const actions = attacker.actions.filter((action) => { return action.type != 'attack' })
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

    addAttackAction(attackerId: string, attackeeId: string, triggerSocialAgro: boolean, triggerSocialAssist: boolean): GameEngine {
        //TODO attacker owner check
        const character = this.getCharacter(attackerId)

        const newAttackAction = new AttackAction({
            engine: this,
            character: character,
            targetId: attackeeId,
            triggerSocialAgro: triggerSocialAgro,
            triggerSocialAssist: triggerSocialAssist
        })
        character.addAction(this, newAttackAction)

        //TODO move this into the attackaction object
        if (attackeeId) {
            let attackee = this.getCharacter(attackeeId)
            if (!!attackee) {
                const t = new Set(attackee.targeters).add(attackerId)
                this.updateCharacter({ id: attackeeId, targeters: Array.from(t.values()) })
            }
        }
        return this
    }

    addForageAction(id: string) {
        const character = this.getCharacter(id)
        character.addAction(this,
            new ForageAction({
                engine: this,
                character: character
            }))
    }

    addMoveToAction(characterId: string, location: Point) {
        //unconscious check
        const character = this.getCharacter(characterId)
        //TODO move this into the action logic
        if (!character || character?.hp! <= 0) {
            console.log('dead characters cannot move')
            return
        }
        character.addAction(this,
            new MoveToAction({
                engine: this,
                character: character,
                location: location
            }))
    }

    addMoveAction(characterId: string, speedAcceleration, rotationSpeed, mode) {
        //unconscious check
        const character = this.getCharacter(characterId)
        //TODO move unconscience check into the action logic
        if (!character || character?.hp! <= 0) {
            console.log('dead characters cannot move')
            return
        }
        character.addAction(this,
            new MoveAction({
                engine: this,
                character: character,
                action: { speedAcceleration, rotationSpeed: rotationSpeed, mode }
            }))
    }

    addActiveCharacter(turn: number, id: string) {
        let t = this.activeCharacters.get(turn)
        if (!t) {
            t = new Set()
            this.activeCharacters.set(turn, t)
            //console.log('made a new set for turn',turn)
        }
        t.add(id)
        //console.log(this.activeCharacters)
    }

    getCharacter(characterId: string) {
        return this.gameWorld.getCharacter(characterId)
    }

    getZonesIn({ top, bottom, left, right, scale }: { top: number, bottom: number, left: number, right: number, scale: number }): ZoneInfo[] {
        //TODO scale determines what *kind* of zones to use, not viewport, I think
        const area = (right - left) * (bottom - top)
        let zones: ZoneInfo[] = []
        if (area < 1000000) {
            //tactical zones
            const width = 120
            for (let x = left; x < right + width; x += width) {
                for (let y = top; y < bottom + width; y += width) {
                    zones.push({
                        name: this.gameWorld.getTacticalZoneName({ x: x, y: y }),
                        x: Math.floor(x / width) * width,
                        y: Math.floor(y / width) * width,
                        width
                    })
                }
            }
        }
        else {
            const width = 600
            //TODO do local zone names
            for (let x = left; x < right + width; x += width) {
                for (let y = top; y < bottom + width; y += width) {
                    zones.push({
                        name: this.gameWorld.getLocalZoneName({ x: x, y: y }),
                        x: Math.floor(x / width) * width,
                        y: Math.floor(y / width) * width,
                        width
                    })
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

        //clear any moveto actions
        //const actions = character.actions.filter((action) => { return action.type != 'moveTo' })
        //this.updateCharacter({ id: character.id, actions: actions })

        //update move action
        //const action: MoveAction = character.actions.find((action) => action.type == 'move') as MoveAction
        //action.mode = 1

        character.addAction(this, new MoveAction({ engine: this, character: character, action: { mode: 1 } }))
        //this.updateCharacter({ id: character.id })
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
        // if (character.mode == 2) {
        //     return false
        // }
        //clear any moveto actions
        //const actions = character.actions.filter((action) => { return action.type != 'moveTo' })
        //this.updateCharacter({ id: character.id, actions: actions })

        //TODO move action
        //this.updateCharacter({ id: character.id, actions: actions })
        character.addAction(this, new MoveAction({ engine: this, character: character, action: { mode: 2 } }))

        return true
    }

    accelerateStop(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        //TODO move action
        //update move action
        //const move = character.actions.findIndex((action) => action.type == 'move');
        //(character.actions[move] as MoveAction).speedAcceleration = 0
        //character.addAction(this, character.actions[move])
        character.addAction(this, new MoveAction({ engine: this, character: character, action: { speedAcceleration: 0 } }))

        //this.updateCharacter({ id: character.id })
        return true
    }

    turnStop(characterId: string, playerId: string | undefined): boolean {
        const character = this.getCharacter(characterId)
        if (!character?.id || character?.playerId != playerId) {
            return false
        }
        // if (character.rotationAcceleration == 0) {
        //     return false
        // }
        //clear any move actions
        //TODO move action
        //const actions = character.actions.filter((action) => { return action.type != 'moveTo' })
        character.addAction(this, new MoveAction({ engine: this, character: character, action: { rotationSpeed: 0 } }))
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
        // if (character.speedAcceleration == -1) {
        //     return false
        // }
        //clear any move actions
        //TODO move action
        //const actions = character.actions.filter((action) => { return action.type != 'moveTo' })
        character.addAction(this, new MoveAction({ engine: this, character: character, action: { speedAcceleration: -1 } }))
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

        character.addAction(this, new MoveAction({ engine: this, character: character, action: { speedAcceleration: 1 } }))
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
        // if (character.rotationAcceleration == LEFT) {
        //     return false
        // }
        //clear any move actions
        //TODO move action
        //const actions = character.actions.filter((action) => { return action.type != 'moveTo' })
        character.addAction(this, new MoveAction({ engine: this, character: character, action: { rotationSpeed: LEFT } }))
        //this.updateCharacter({ id: character.id, actions: actions })
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
        // if (character.rotationAcceleration == RIGHT) {
        //     return false
        // }
        //clear any move actions
        //TODO move action
        character.addAction(this, new MoveAction({ engine: this, character: character, action: { rotationSpeed: RIGHT } }))
        //this.updateCharacter({ id: character.id, actions: actions })
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

    /**
     * pushes updates to the gameworld and updates the turns the character will be active in
     * @param updates 
     * @returns 
     */
    updateCharacter(updates: Partial<Character>): GameEngine {

        const character = this.gameWorld.updateCharacter(updates)
            .getCharacter(updates.id)!

        //console.log(character)

        //check for things that make this an active character
        if (!!character && (
            //has any rotation acceleration
            //character.rotationAcceleration != 0 ||
            //has any speed acceleration
            //character.speedAcceleration != 0 ||
            //has any speed
            //character.speed != 0 ||
            //has any actions
            character.actions?.length != 0 ||
            //dieing
            (character.hp <= 0 && character.hp > -10))
        ) {
            //console.log('activating', character.name)
            //console.log(character)
            //TODO change this to an action in the right turn
            //this.addActiveCharacter(this.currentTurn + 1, character.id)
            //this.activeCharacters.get(0).add(character.id)
        }
        else if (!!character) {
            //console.log('deactivating', character.id)
            //TODO remove the character from all the turns it has actions for
            //this.activeCharacters.get(0)?.delete(character.id)
        }
        return this
    }

    //
    createCharacter(partial: Partial<Character>): GameEngine {
        //gameengine doesn't generate id's
        if (!partial || !partial.id) {
            return this
        }
        const character = this.updateCharacter(partial).getCharacter(partial.id)
        //TODO generate default actions
        //character.addAction(this, new ExhaustionAction({ engine: this, character }))

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

    calculateXp(party: Character[], monsters: Character[]) {
        //TODO calculate xp
        return 500
    }

    calculateSpeed(character: CharacterInterface, action: MoveAction, dt: number) {
        let newSpeed = 0
        //soft caps might be the same as hard caps
        //if mode or acceleration are 0 then the soft caps get pushed to 0
        const currentModeMaxSpeed = character.maxSpeed * action.mode * Math.abs(action.speedAcceleration)
        const currentModeMinSpeed = -character.maxSpeed * action.mode * Math.abs(action.speedAcceleration)
        let mode = action.mode

        let outsideSoftCaps = currentModeMinSpeed > action.speed || action.speed > currentModeMaxSpeed
        //console.log('outsideSoftCaps', outsideSoftCaps)
        let accel = action.speedAcceleration
        //if we're outside soft caps or acceleration is 0 and we're moving
        if (outsideSoftCaps || (action.speedAcceleration == 0 && action.speed != 0)) {
            //console.log('forcing sprinting')
            //force sprinting
            mode = 2
            //force a direction if acceleration is 0 but we need to slow down
            //force acceleration in the opposite direction of movement
            if (action.speed > 0) {
                accel = -1
            }
            else if (action.speed < 0) {
                accel = 1
            }
        }
        //calculate the speedDelta now that we're taking into account slowing down
        let speedDelta = accel * mode * dt / this.accelerationMultiplier
        //console.log('speedDelta', speedDelta)

        //if the character is trying to stop
        if (action.speedAcceleration == 0) {
            //
            if (action.speed > 0) {
                //character is not accellerating while moving forward
                //don't let the character go slower the 0
                newSpeed = Math.max(0, action.speed + speedDelta)
                //console.log(newSpeed)
            }
            else if (action.speed < 0) {
                //ceiling the new speed at 0
                //character is not accellerating while moving backward
                //don't let the character go faster the 0
                newSpeed = Math.min(0, action.speed + speedDelta)
            }
        }
        //character is accelerating forward
        else if (action.speedAcceleration > 0) {
            //character is already moving forward
            if (action.speed >= 0) {
                //accelerating forward while moving forward 
                //if we started out going faster then currentModeMaxSpeed
                if (action.speed > currentModeMaxSpeed) {
                    //then don't slow down to less then the softmax
                    newSpeed = Math.max(currentModeMaxSpeed, action.speed + speedDelta)
                }
                //we started out going slower then currentModeMaxSpeed 
                else {
                    //then don't go faster then currentModeMaxSpeed
                    newSpeed = Math.min(currentModeMaxSpeed, action.speed + speedDelta)

                }
            }
            else if (action.speed < 0) {
                //accelerating forward while going backwards
                //don't let the character go faster then currentModeMaxSpeed
                newSpeed = Math.min(currentModeMaxSpeed, action.speed + speedDelta)
            }
        }
        //character is accelerating backward
        else {
            //character is already moving forward
            if (action.speed >= 0) {
                //accelerating backwards while moving forwards
                //don't let the character go slower then currentModeMinSpeed
                newSpeed = Math.max(currentModeMinSpeed, action.speed + speedDelta)
            }
            else if (action.speed < 0) {
                //accelerating backwards while moving backwards
                //character started out going backwards faster then currentModeMinSpeed
                if (action.speed < currentModeMinSpeed) {
                    //then don't slow down to less then currentModeMinSpeed
                    newSpeed = Math.min(currentModeMinSpeed, action.speed + speedDelta)
                }
                //accelerating backward while moving backward slower then currentModeMaxSpeed 
                else {
                    //then don't go faster then currentModeMinSpeed
                    newSpeed = Math.max(currentModeMinSpeed, action.speed + speedDelta)
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

    calculateRotation(character: Character, action: MoveAction, dt: number) {
        let newAngle = character.rotation
        if (action.rotationSpeed != 0) {
            newAngle = character.rotation + action.rotationSpeed * dt / this.rotationMultiplier
        }
        //normalize it to between -2pi and 2pi
        newAngle %= (Math.PI * 2)
        //normalize it to 0 to 4pi
        newAngle += Math.PI * 2
        //normalize to 0 to 2pi
        newAngle %= (Math.PI * 2)
        return newAngle
    }

    calculatePosition(character: CharacterInterface, action: MoveAction, dt: number) {
        console.log(action)
        const w = (action?.rotationSpeed | 0) / this.rotationMultiplier
        let x: number = character.location.x
        let y: number = character.location.y
        if (action.speed != 0) {
            //calculate new position
            x = character.location.x + action.speed * (Math.cos(character.rotation + w * dt)) * dt / this.speedMultiplier
            y = character.location.y - action.speed * (Math.sin(character.rotation + w * dt)) * dt / this.speedMultiplier
        }
        return { x, y }
    }
}