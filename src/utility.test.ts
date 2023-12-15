import { getRandomPoint } from "./utility"

describe('getRandomPoint', () => {
    test('should', () => {
        const p = getRandomPoint({ origin: { x: 0, y: 0 }, radius: 10 })
        expect(p.x).toBeLessThan(10)
        expect(p.x).toBeGreaterThan(-10)
        expect(p.y).toBeLessThan(10)
        expect(p.y).toBeGreaterThan(-10)
    })
})