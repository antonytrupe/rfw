import Player from "./Player"

describe('Player', () => {
    test('should', () => {
        const p = new Player({})
        expect(p.claimedCharacters).toEqual([])
        expect(p.controlledCharacter).toBe("")
        expect(p.email).toBe("")
        expect(p.id).toBe("")
        expect(p.maxClaimedCharacters).toBe(2)
    })
})