export default class Character {
    constructor({ acceleration, id, size, maxSpeed, x, y, speed, turnDirection, angle }: {
        acceleration?: number,
        id?: string,
        size?: number,
        maxSpeed?: number,
        x?: number,
        y?: number,
        speed?: number,
        turnDirection?: number,
        angle?: number
    }) {
        if (!!id) this.id = id
        if (!!acceleration) this.acceleration = acceleration
        if (!!size) this.size = size
        if (!!maxSpeed) this.maxSpeed = maxSpeed
        if (!!x) this.x = x
        if (!!y) this.y = y
        if (!!speed) this.speed = speed
        if (!!turnDirection) this.turnDirection = turnDirection
        if (!!angle) this.angle = angle
    }
    acceleration: number = 0
    id: string = ''
    size: number = 5
    maxSpeed: number = 30
    x: number = 0
    y: number = 0
    speed: number = 0
    turnDirection: number = 0
    angle: number = Math.PI / 2
}

