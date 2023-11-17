import EventEmitter from "events"
import GameEngine from "./GameEngine"
import Character from "./Character"

describe('GameEngine', () => {
    let gameEngine: GameEngine
    let eventEmitter: EventEmitter
    beforeEach(() => {
        const ticksPerSecond = 1
        eventEmitter = new EventEmitter()
        gameEngine = new GameEngine({ ticksPerSecond }, eventEmitter)
    })

    describe("getDirection", () => {
        test('N', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 0, y: -1 })).toBe(0*Math.PI)
        })
        test('NE', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 1, y: -1 })).toBe(1/4*Math.PI)
        })
        test('E', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(2/4*Math.PI)
        })
        test('SE', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(3/4*Math.PI)
        })
        test('S', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(4/4*Math.PI)
        })
        test('SW', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: -1, y: 1 })).toBe(5/4*Math.PI)
        })
        test('W', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: -1, y: 0 })).toBe(6/4*Math.PI)
        })
        test('NW', () => {
            expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: -1, y: -1 })).toBe(7/4*Math.PI)
        })
    })
    describe("actions", () => {
        beforeEach(() => {
            gameEngine.createCharacter({ id: '1', x: 0, y: 0 })
        })
        describe("move", () => {
            describe("when starting facing north/up", () => {

                test('should keep going straight', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 0, y: -40 } }] })
                    gameEngine.step(1000, 0)
                    const u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(0)
                })

                test('should turn NW/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: -40 } }] })
                    gameEngine.step(1000, 0)
                    const u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(7 / 4 * Math.PI)
                })

                test('should turn W/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: 0 } }] })
                    gameEngine.step(1000, 0)
                    const u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(3 / 2 * Math.PI)
                })

                test('should turn SW/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: 40 } }] })
                    gameEngine.step(1000, 0)
                    const u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(5 / 4 * Math.PI)
                })

                test('should turn NE/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: -40 } }] })
                    gameEngine.step(10000, 0)
                    const u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(1 / 4 * Math.PI)
                })

                test('should turn E/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: 0 } }] })
                    gameEngine.step(10000, 0)
                    const u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(1 / 2 * Math.PI)
                })

                test('should turn SE/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: 40 } }] })
                    gameEngine.step(10000, 0)
                    const u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(3 / 4 * Math.PI)
                })

            })

        })



    })


    test('should add a new chararacter ', () => {
        gameEngine.createCharacter({ id: '1', x: 0, y: 0 })
        gameEngine.createCharacter({ id: '2', x: 0, y: 0 })
        gameEngine.createCharacter({ id: '3', x: 0, y: 0 })
        //console.log(gameEngine.gameWorld.getAllCharacters())
        expect(Array.from(gameEngine.gameWorld.getAllCharacters().values()).length).toBe(3)
    })


    describe('movement', () => {

        test('should not move if speed and acceleration are 0', () => {
            const c = new Character({ speed: 0, speedAcceleration: 0 })
            // gameEngine.gameWorld.characters = [c]
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1000, 0)
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            //check the characters position
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(0)
            expect(nc.speedAcceleration).toBe(0)
        })

        test('should slow down if moving but acceleration is 0', () => {
            const c = new Character({ speed: 30, speedAcceleration: 0 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(-5)
            expect(nc.speed).toBe(0)
            expect(nc.speedAcceleration).toBe(0)
        })

        test('should run straight forward at 5ft per second', () => {
            const c = new Character({ speed: 30, speedAcceleration: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(-5)
            expect(nc.speed).toBe(30)
            expect(nc.speedAcceleration).toBe(1)
        })

        test('should sprint straight forward at 10ft per second', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 2 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(-10)
            expect(nc.speed).toBe(60)
            expect(nc.speedAcceleration).toBe(1)
        })

        test('should accelerate from not moving to running in 600ms', () => {
            const c = new Character({ speedAcceleration: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(30)
        })

        test('should accelerate from not moving to sprinting in 1200ms', () => {
            const c = new Character({ speedAcceleration: 1, mode: 2 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(400, 0)
            //check the characters position
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(40)

            gameEngine.step(200, 400)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0];

            expect(nc.x).toBe(0)
            expect(nc.y).toBeCloseTo(-1.333)
            expect(nc.speed).toBe(60)

            gameEngine.step(100, 600)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0];

            expect(nc.x).toBe(0)
            expect(nc.y).toBeCloseTo(-2.333)
            expect(nc.speed).toBe(60)

        })

        test('should gradutally go from 60 to 30 when transitioning from sprinting to running', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            //expect(nc.y).toBe(-5)
            expect(nc.speed).not.toBe(30)
        })

        test('should do 60 to 0 in .6 seconds and 6ft', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(-6)
            expect(nc.speed).toBe(0)
        })

        test('should do 60 to 0 in .6 seconds and 6ft', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 2 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(-6)
            expect(nc.speed).toBe(0)
        })


        test('should turn 180 degrees in 1 second', () => {
            const c = new Character({ directionAcceleration: 1 })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.direction).toBe(0)
            //move the character
            gameEngine.step(1000, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            //check the characters position
            expect(nc.direction).toBe(Math.PI)
        })

        test('should turn 360 degrees in 2 second', () => {
            const c = new Character({ directionAcceleration: 1 })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.direction).toBe(0)
            //move the character
            gameEngine.step(2000, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            //check the characters position
            expect(nc.direction).toBe(0)
        })

        test('should turn 90 degrees to the right in half a second', () => {
            const c = new Character({ directionAcceleration: -1 })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.direction).toBe(0)
            //move the character
            gameEngine.step(500, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            //check the characters position
            expect(nc.direction).toBe(Math.PI / 2)
        })
        test('should turn 90 degrees to the left in half a second', () => {
            const c = new Character({ directionAcceleration: 1 })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            expect(nc.direction).toBe(0)
            //move the character
            gameEngine.step(500, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0];
            //check the characters position
            expect(nc.direction).toBe(3 / 2 * Math.PI)
        })


    })
    describe('speed', () => {

    })


})