import { Action, Actions } from "./actions/Action"
import Point from "./Point"
import { ZONETYPE } from "./ZONETYPE"
import { SHAPE } from "./SHAPE"
import WorldObject from "./WorldObject"
import { GameEvents } from "./GameEvent"
import GameEngine from "@/GameEngine"
import { clamp } from "@/utility"

export default class Character extends WorldObject implements CharacterInterface {
    playerId: string
    maxSpeed: number
    speed: number
    speedAcceleration: number
    mode: number //1 for walk, 2 for  run, .5 for stealth, .25 for crawl
    rotationAcceleration: number
    rotation: number
    hp: number
    tmpHp: number
    maxHp: number
    characterClass: string
    level: number
    bab: number[]
    target: string
    targeters: string[]
    actions: Actions
    actionsRemaining: number
    events: GameEvents = []
    birthdate: Date
    age: number
    race: string
    xp: number

    doActions({ engine, dt, now }: { engine: GameEngine, dt: number, now: number }): void {
        //console.log('character doActions', this.name)
        this.actions.forEach((action) => {
            if (!action.complete && !!action.do) {
                action.do({ character: this, engine, dt, now })
            }
        })
    }

    addAction(engine: GameEngine, action: Action) {
        //console.log('character addAction', this.name, action.turn)
        engine.addActiveCharacter(action.turn, this.id)
        engine.updateCharacter(this)
    }

    takeDamage({ engine, damage }: { engine: GameEngine, damage: number }) {
        let character = engine.updateCharacter({ id: this.id, hp: clamp(this.hp - damage, -10, this.maxHp) }).getCharacter(this.id)!

        //todo if its unconcious
        if (this.hp <= 0) {
            //clear accelerations and all actions
            character = engine.updateCharacter({ id: this.id, actions: [], rotationAcceleration: 0, speedAcceleration: 0 }).getCharacter(this.id)!
        }
        //if its deaddead
        if (this.hp <= -10) {
            //turn it into a tombstone
            //this.deleteCharacter(character.id)
            //this.updateTombstone(character)
        }
    }

    constructor({
        id = "__test__",
        name = "__test__",
        playerId = "",
        rotation = 0,
        location = { x: 0, y: 0 },
        maxSpeed = 30,
        mode = 1,
        speed = 0,
        rotationAcceleration = 0,
        speedAcceleration = 0,
        hp = 1,
        tmpHp = 0,
        maxHp = 1,
        characterClass = 'COMMONER',
        level = 1,
        xp = 0,
        bab = [0],
        target = '',
        targeters = [],
        actions = [],
        actionsRemaining = 1,
        age = 30,
        race = "HUMAN",

    }: CharacterInterface) {
        super({ id: id, location: location, rotation: rotation, shape: SHAPE.CIRCLE, radiusX: 2.5, zoneType: [ZONETYPE.TACTICAL] })
        this.id = id
        this.name = name
        this.playerId = playerId
        this.maxSpeed = maxSpeed
        this.location = location
        this.mode = mode
        this.speed = speed
        this.rotationAcceleration = rotationAcceleration
        this.rotation = rotation
        this.speedAcceleration = speedAcceleration
        this.hp = hp
        this.tmpHp = tmpHp
        this.maxHp = maxHp
        this.characterClass = characterClass
        this.level = level
        this.xp = xp
        this.bab = bab
        this.target = target
        this.targeters = targeters
        this.actions = actions
        this.actionsRemaining = actionsRemaining
        this.birthdate = new Date(new Date().getTime() - age * 365 * 24 * 60 * 60 * 1000)
        this.age = age
        this.race = race
    }

}

export interface CharacterInterface {
    id?: string
    name?: string
    playerId?: string
    rotation?: number
    location?: Point
    maxSpeed?: number
    mode?: number
    speed?: number
    rotationAcceleration?: number
    speedAcceleration?: number
    hp?: number
    tmpHp?: number
    maxHp?: number
    characterClass?: string
    level?: number
    xp?: number
    bab?: number[]
    target?: string
    targeters?: string[]
    actions?: Action[]
    actionsRemaining?: number
    age?: number
    race?: string
}