export default class Character {

    constructor({
        id = "undefined",
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
        bab = [0],
        target = '',
        actions = [],
        actionsRemaining = 1,
    }: {
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
        bab?: number[]
        target?: string
        actions?: []
        actionsRemaining?: number
    }) {
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
        this.bab = bab
        this.target = target
        this.actions = actions
        this.actionsRemaining = actionsRemaining
    }
    id: string
    playerId: string
    size: number
    maxSpeed: number
    x: number
    y: number
    speed: number
    speedAcceleration: number
    mode: number //1 for run, 2 for double run, .5 for walk/stealth, .25 for crawl
    directionAcceleration: number
    direction: number
    hp: number
    tmpHp: number
    maxHp: number
    characterClass: string
    level: number
    bab: number[]
    target: string
    actions: Action[]
    actionsRemaining: number
}

export class Action {
    action: string = ''
    target: string = ''
}