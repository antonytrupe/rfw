export default class Character {
    constructor({
        id = "undefined",
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
        level = 1
    }: {
        id?: string
        size: number
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
    }) {
        this.id = id
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
    }
    speedAcceleration: number
    id: string
    size: number
    maxSpeed: number
    x: number
    y: number
    speed: number
    mode: number //1 for run, 2 for double run, .5 for walk/stealth, .25 for crawl
    directionAcceleration: number
    direction: number
    hp: number
    tmpHp: number
    maxHp: number
    characterClass: string
    level: number
}

