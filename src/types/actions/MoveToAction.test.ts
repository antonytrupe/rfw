import GameEngine from "@/GameEngine"
import EventEmitter from "events"
import Character from "../Character"
import MoveToAction from "./MoveToAction"
import { CONTINUOUS } from "./Action"

describe('MoveToAction', () => {

    let gameEngine: GameEngine
    let eventEmitter: EventEmitter
    let one: Character

    beforeEach(() => {
        eventEmitter = new EventEmitter()
        gameEngine = new GameEngine({ fps: 30, doGameLogic: true }, eventEmitter)
        gameEngine.createCharacter({ id: 'one', playerId: "one", location: { x: 0, y: 0 } })

        one = gameEngine.getCharacter("one")
    })

    test("should have a character", () => {
        expect(one.id).toBe("one")
        expect(one.playerId).toBe("one")
    })

    test("should have a movetoaction", () => {
        one.addAction(gameEngine,
            new MoveToAction({
                engine: gameEngine,
                character: one,
                location: { x: 1, y: 1 }
            }))

        expect(one.actions.length).toBe(1)
        expect(one.actions[0].type).toBe("moveTo")
    })

    test("should get added to the active characters list", () => {
        one.addAction(gameEngine,
            new MoveToAction({
                engine: gameEngine,
                character: one,
                location: { x: 1, y: 1 }
            }))

        expect(gameEngine.getActiveCharacters().get(CONTINUOUS).size).toBe(1)
    })

    test("should get a move action after a tick", () => {
        one.addAction(gameEngine,
            new MoveToAction({
                engine: gameEngine,
                character: one,
                location: { x: 10, y: 10 }
            }))

        gameEngine.step(30, 30)

        expect(one.actions.length).toBe(2)
        expect(one.actions[0].type).toBe("moveTo")
        expect(one.actions[1].type).toBe("move")
    })

    test("should not have any actions if we're already there", () => {
        one.addAction(gameEngine,
            new MoveToAction({
                engine: gameEngine,
                character: one,
                location: { x: 1, y: 1 }
            }))

        gameEngine.step(30, 30)

        expect(one.actions.length).toBe(0)
    })


    test("should not have any actions once we get there", () => {
        one.addAction(gameEngine,
            new MoveToAction({
                engine: gameEngine,
                character: one,
                location: { x: 10, y: 10 }
            }))

        expect(one.location).toStrictEqual({ x: 0, y: 0 })

        gameEngine.step(30, 30)

        expect(one.actions.length).toBe(2)
        expect(one.actions[0].type).toBe("moveTo")
        expect(one.actions[1].type).toBe("move")

        expect(one.location).toStrictEqual({ x: 0, y: 0 })

        gameEngine.step(1000, 1030)

        expect(one.location).toStrictEqual({ x: 0, y: 0 })

        expect(one.actions.length).toBe(0)


    })



})