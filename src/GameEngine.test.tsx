import EventEmitter from "events"
import GameEngine from "./GameEngine"
import Character from "./Character"
import * as CONSTANTS from "./CONSTANTS";

describe('GameEngine', () => {
    let gameEngine: GameEngine
    let eventEmitter: EventEmitter
    beforeEach(() => {
        const ticksPerSecond = 1
        eventEmitter = new EventEmitter()
        gameEngine = new GameEngine({ ticksPerSecond }, eventEmitter)
    })

    describe('Events', () => {
        test('should add a new chararacter ', () => {
            gameEngine.createCharacter({})
            expect(gameEngine.gameWorld.characters.length).toBe(3)
        })
    })

    describe('movement', () => {

        test('should not move if speed and acceleration are 0', () => {
            const c = new Character({ speed: 0, speedAcceleration: 0 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(1000)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(0)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(0)
            expect(gameEngine.gameWorld.characters[0].speedAcceleration).toBe(0)
        })

        test('should slow down if moving but acceleration is 0', () => {
            const c = new Character({ speed: 30, speedAcceleration: 0 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(1000)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(-5)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(0)
            expect(gameEngine.gameWorld.characters[0].speedAcceleration).toBe(0)
        })

        test('should run straight forward at 5ft per second', () => {
            const c = new Character({ speed: 30, speedAcceleration: 1 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(1000)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(-5)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(30)
            expect(gameEngine.gameWorld.characters[0].speedAcceleration).toBe(1)
        })

        test('should sprint straight forward at 10ft per second', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 2 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(1000)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(-10)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(60)
            expect(gameEngine.gameWorld.characters[0].speedAcceleration).toBe(1)
        })

        test('should accelerate from not moving to running in 600ms', () => {
            const c = new Character({ speedAcceleration: 1 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(600)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(0)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(30)
        })

        test('should accelerate from not moving to sprinting in 1200ms', () => {
            const c = new Character({ speedAcceleration: 1, mode: 2 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(400)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(0)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(40)
            gameEngine.step(200)
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBeCloseTo(-1.333)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(60)

            gameEngine.step(100)
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBeCloseTo(-2.333)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(60)

        })

        test('should gradutally go from 60 to 30 when transitioning from sprinting to running', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 1 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(1)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            //expect(gameEngine.gameWorld.characters[0].y).toBe(-5)
            expect(gameEngine.gameWorld.characters[0].speed).not.toBe(30)
        })

        test('should do 60 to 0 in .6 seconds and 6ft', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 1 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(600)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(-6)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(0)
        })

        test('should do 60 to 0 in .6 seconds and 6ft', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 2 })
            gameEngine.gameWorld.characters = [c]
            //move the character
            gameEngine.step(600)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].x).toBe(0)
            expect(gameEngine.gameWorld.characters[0].y).toBe(-6)
            expect(gameEngine.gameWorld.characters[0].speed).toBe(0)
        })


        test('should turn 180 degrees in 1 second', () => {
            const c = new Character({ directionAcceleration: 1 })
            gameEngine.gameWorld.characters = [c]
            expect(gameEngine.gameWorld.characters[0].direction).toBe(0)
            //move the character
            gameEngine.step(1000)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].direction).toBe(-Math.PI)
        })

        test('should turn 360 degrees in 2 second', () => {
            const c = new Character({ directionAcceleration: 1 })
            gameEngine.gameWorld.characters = [c]
            expect(gameEngine.gameWorld.characters[0].direction).toBe(0)
            //move the character
            gameEngine.step(2000)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].direction).toBe(-0)
        })

        test('should turn 90 degrees to the right in half a second', () => {
            const c = new Character({ directionAcceleration: -1 })
            gameEngine.gameWorld.characters = [c]
            expect(gameEngine.gameWorld.characters[0].direction).toBe(0)
            //move the character
            gameEngine.step(500)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].direction).toBe(Math.PI / 2)
        })
        test('should turn 90 degrees to the left in half a second', () => {
            const c = new Character({ directionAcceleration: 1 })
            gameEngine.gameWorld.characters = [c]
            expect(gameEngine.gameWorld.characters[0].direction).toBe(0)
            //move the character
            gameEngine.step(500)
            //check the characters position
            expect(gameEngine.gameWorld.characters[0].direction).toBe(-Math.PI / 2)
        })


    })
    describe('speed', () => {

    })


})