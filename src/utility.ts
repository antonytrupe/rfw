import Point from "./types/Point"

export function roll({ size = 20, count = 1, modifier = 0 }: { size?: number, count?: number, modifier?: number }) {
    let sum = modifier
    for (let i = 0; i < count; i++) {
        sum += Math.floor(Math.random() * size + 1)
    }
    return sum
}

export function getRandomPoint({ origin: { x, y }, radius }: { origin: Point, radius: number }) {
    const direction = Math.random() * Math.PI * 2
    const r = Math.random() * radius
    x = r * Math.cos(direction) + x
    y = r * Math.sin(direction) + y
    return { x, y }
}

export function clamp(number: number, min: number, max: number) {
    return Math.max(min, Math.min(number, max))
}