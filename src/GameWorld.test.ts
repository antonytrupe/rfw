import GameWorld from "./GameWorld"
import WorldObject from "./types/WorldObject"

describe("GameWorld tests", () => {
    describe("updateCharacter", () => {

        test("tactical object in only one zone", () => {
            const w = new GameWorld()
            const o = new WorldObject({
                location: {
                    x: 5,
                    y: 5
                }, radiusX: 5
            })


            const z = w.getZones(o)

            expect(z).toStrictEqual(["T:0:0"])
        })

        test("tactical object in two zones", () => {
            const w = new GameWorld()
            const o = new WorldObject({
                location: {
                    x: 0,
                    y: 5
                }, radiusX: 5
            })

            const z = w.getZones(o)

            expect(z).toStrictEqual(["T:0:0","T:-1:0"])
        })
    })


    describe("getCharactersAt", () => {

        test("find a character that doesn't overlaps into a zone", () => {
            const w = new GameWorld()
            w.updateCharacter({
                id: "one", location: {
                    x: 1,
                    y: 1
                }, radiusX: 5
            })
            const c = w.getCharacterAt({
                x: 2,
                y: 2
            })
            expect(c.id).toBe("one")
        })

        test("find a character that overlaps into a zone", () => {
            const w = new GameWorld()
            w.updateCharacter({
                id: "one", location: {
                    x: 1,
                    y: 1
                }, radiusX: 5
            })
            const c = w.getCharacterAt({
                x: -1,
                y: -1
            })
            expect(c.id).toBe("one")
        })
    })
})