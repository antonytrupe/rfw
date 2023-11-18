import Character from "./types/Character";

describe('Character', () => {
    test('should have a default direction of 0', () => {
        const c = new Character({})
        expect(c.direction).toBe(0)
    })

})
