import { Action } from "./Action"


export default class Character {
    id: string
    playerId: string
    size: number
    maxSpeed: number
    x: number
    y: number
    speed: number
    speedAcceleration: number
    mode: number //1 for walk, 2 for  run, .5 for stealth, .25 for crawl
    directionAcceleration: number
    direction: number
    hp: number
    tmpHp: number
    maxHp: number
    characterClass: string
    level: number
    bab: number[]
    target: string
    targeters: string[]
    actions: Action[]
    actionsRemaining: number
    birthdate: Date
    age: number
    race: string
    xp: number

    constructor({
        id = "__test__",
        playerId = "",
        size = 5,
        direction = 0,
        x = 0,
        y = 0,
        maxSpeed = 30,
        mode = 1,
        speed = 0,
        directionAcceleration = 0,
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
        this.id = id
        this.playerId = playerId
        this.size = size
        this.maxSpeed = maxSpeed
        this.x = x
        this.y = y
        this.mode = mode
        this.speed = speed
        this.directionAcceleration = directionAcceleration
        this.direction = direction
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
    playerId?: string
    size?: number
    direction?: number
    x?: number
    y?: number
    maxSpeed?: number
    mode?: number
    speed?: number
    directionAcceleration?: number
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
    actions?: []
    actionsRemaining?: number
    age?: number
    race?: string
}