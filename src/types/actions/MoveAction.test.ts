import GameEngine from "@/GameEngine"
import EventEmitter from "events"
import Character from "../Character"
import { CONTINUOUS } from "./Action"
import MoveAction from "./MoveAction"
import { LEFT } from "../CONSTANTS"

describe('MoveAction', () => {

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

    test("action gets added", () => {
        const r = gameEngine.turnLeft("one", "one")
        expect(r).toBeTruthy()
        expect(one.actions.length).toBe(1)
    })

    test("second move action doesn't gets added", () => {
        const r = gameEngine.turnLeft("one", "one")
        gameEngine.turnLeft("one", "one")
        expect(r).toBeTruthy()
        expect(one.actions.length).toBe(1)
    })

    test("turn and accelerate combine", () => {
        gameEngine.turnLeft("one", "one")
        gameEngine.accelerate("one", "one")

        expect(one.actions.length).toBe(1)
        expect(one.actions[0].type).toBe("move")

        expect((one.actions[0] as MoveAction).mode).toBe(1)
        expect((one.actions[0] as MoveAction).speedAcceleration).toBe(1)
        expect((one.actions[0] as MoveAction).rotationSpeed).toBe(LEFT)

    })

    test("action is a moveaction", () => {
        gameEngine.turnLeft("one", "one")
        expect(one.actions[0].type).toBe("move")
    })

    test("action is continuous", () => {
        gameEngine.turnLeft("one", "one")
        expect(one.actions[0].turn).toBe(CONTINUOUS)
    })

    test("character is in the continuous turn", () => {
        gameEngine.turnLeft("one", "one")
        expect(gameEngine.getActiveCharacters().has(CONTINUOUS)).toBeTruthy()
        expect(gameEngine.getActiveCharacters().get(CONTINUOUS).has("one")).toBeTruthy()
    })

    test("character is at the origin", () => {
        expect(one.location).toStrictEqual({ x: 0, y: 0 })
    })

    test("character is facing north", () => {
        expect(one.rotation).toBe(0)
    })

    describe('rotation', () => {

        test("to the left one step", () => {
            //console.log(one)
            const r = gameEngine.turnLeft("one", "one")
            gameEngine.step(30, 30)
            expect(one.rotation).toBeCloseTo(.056)
            expect(one.location).toStrictEqual({ x: 0, y: 0 })
        })

        test("to the left two steps", () => {
            //console.log(one)
            const r = gameEngine.turnLeft("one", "one")
            gameEngine.step(30, new Date().getTime() + 30)
            expect(one.rotation).toBeCloseTo(.056)
            expect(one.location).toStrictEqual({ x: 0, y: 0 })

            gameEngine.step(30, new Date().getTime() + 60)
            expect(one.rotation).toBeCloseTo(.11999999)
            expect(one.location).toStrictEqual({ x: 0, y: 0 })

        })

        test("to the left 180", () => {
            //console.log(one)
            const delta = 1570
            const r = gameEngine.turnLeft("one", "one")
            gameEngine.step(delta, new Date().getTime() + delta)
            expect(one.rotation).toBeCloseTo(Math.PI)
            expect(one.location).toStrictEqual({ x: 0, y: 0 })
        })

        test("to the right one step", () => {
            //console.log(one)
            const r = gameEngine.turnRight("one", "one")
            gameEngine.step(30, new Date().getTime() + 30)
            expect(one.rotation).toBeCloseTo(6.223185307179587)
            expect(one.location).toStrictEqual({ x: 0, y: 0 })
        })

        test("to the right two steps", () => {
            //console.log(one)
            const r = gameEngine.turnRight("one", "one")
            gameEngine.step(30, new Date().getTime() + 30)
            expect(one.rotation).toBeCloseTo(6.223185307179587)
            expect(one.location).toStrictEqual({ x: 0, y: 0 })

            gameEngine.step(30, new Date().getTime() + 60)
            expect(one.rotation).toBeCloseTo(6.163185307179587)
            expect(one.location).toStrictEqual({ x: 0, y: 0 })

        })
    })

    describe('acceleration', () => {

        test("check the action", () => {
            //console.log(one)
            const r = gameEngine.accelerate("one", "one")
            expect((one.actions[0] as MoveAction).speedAcceleration).toBe(1)
            expect((one.actions[0] as MoveAction).speed).toBe(0)
        })

        test("when we step the engine a little bit", () => {
            //console.log(one)
            const r = gameEngine.accelerate("one", "one")
            gameEngine.step(30, new Date().getTime() + 30)
            expect((one.actions[0] as MoveAction).speed).toBe(1.5)
            expect(one.location).toStrictEqual({ x: 0.00375, y: 0 })
        })

        test("when we step the engine a twice", () => {
            //console.log(one)
            const r = gameEngine.accelerate("one", "one")
            gameEngine.step(30, new Date().getTime() + 30)
            expect((one.actions[0] as MoveAction).speed).toBe(1.5)
            expect(one.location).toStrictEqual({ x: 0.00375, y: 0 })

            gameEngine.step(30, new Date().getTime() + 60)
            expect((one.actions[0] as MoveAction).speed).toBe(3)
            expect(one.location).toStrictEqual({ x: 0.015, y: 0 })

        })
    })
})