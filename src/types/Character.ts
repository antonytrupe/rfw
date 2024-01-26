import { Action, Actions } from "./Action"
import Point from "./Point"
import { ZONETYPE } from "./ZONETYPE"
import { SHAPE } from "./SHAPE"
import WorldObject from "./WorldObject"

export default class Character extends WorldObject implements CharacterInterface {
    //matterId: number
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
    birthdate: Date
    age: number
    race: string
    xp: number

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
        race = "HUMAN"
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

interface CharacterInterface {
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