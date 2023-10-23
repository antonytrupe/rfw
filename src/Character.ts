export default class Character {
    constructor({
        id = "undefined",
        size = 5,
        angle: direction = 0,
        x = 0,
        y = 0,
        maxSpeed = 30,
        mode = 1,
        speed = 0,
        directionAcceleration: directionAcceleration = 0,
        speedAcceleration: speedAcceleration = 0, }: {
            id?: string,
            size?: number,
            angle?: number
            x?: number,
            y?: number,
            maxSpeed?: number,
            mode?: number,
            speed?: number,
            directionAcceleration?: number,
            speedAcceleration?: number,

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
}

