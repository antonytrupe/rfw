import { roll } from "./utility"

describe('Roll', () => {
    test('1d1', () => {
        expect(roll({ size: 1 })).toBe(1)
    })
    test('10d1', () => {
        expect(roll({ count: 10, size: 1 })).toBe(10)
    })
    test('10d1+10', () => {
        expect(roll({ count: 10, size: 1, modifier: 10 })).toBe(20)
    })
    test('2d10+10', () => {
        for (let i = 0; i < 10000; i++) {
            const r = roll({ count: 2, size: 10, modifier: 10 })
            expect(r).toBeGreaterThan(11)
            expect(r).not.toBeGreaterThan(30)
        }
    })
})