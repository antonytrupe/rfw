import EventEmitter from "events"
import GameEngine from "./GameEngine"
import Character from "./Character"


describe('GameEngine', () => {
    let gameEngine: GameEngine
    let eventEmitter: EventEmitter
    const E = 0 / 4 * Math.PI
    const NE = 1 / 4 * Math.PI
    const N = 2 / 4 * Math.PI
    const NW = 3 / 4 * Math.PI
    const W = 4 / 4 * Math.PI
    const SW = 5 / 4 * Math.PI
    const S = 6 / 4 * Math.PI
    const SE = 7 / 4 * Math.PI
    const LEFT = 1
    const RIGHT = -1

    beforeEach(() => {
        const ticksPerSecond = 1
        eventEmitter = new EventEmitter()
        gameEngine = new GameEngine({ ticksPerSecond }, eventEmitter)
    })

    test('should add 3 new chararacters', () => {
        gameEngine.createCharacter({ id: '1', x: 0, y: 0 })
        gameEngine.createCharacter({ id: '2', x: 0, y: 0 })
        gameEngine.createCharacter({ id: '3', x: 0, y: 0 })
        //console.log(gameEngine.gameWorld.getAllCharacters())
        expect(Array.from(gameEngine.gameWorld.getAllCharacters().values()).length).toBe(3)
    })

    describe("getDirection", () => {
        describe("from origin", () => {
            test('E', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(E)
            })

            test('NE', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 1, y: -1 })).toBeCloseTo(NE)
            })

            test('N', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 0, y: -1 })).toBeCloseTo(N)
            })

            test('NW', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: -1, y: -1 })).toBeCloseTo(NW)
            })

            test('W', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(W)
            })

            test('SW', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: -1, y: 1 })).toBeCloseTo(SW)
            })

            test('S', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(S)
            })

            test('SE', () => {
                expect(gameEngine.getDirection({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(SE)
            })
        })

        describe("from 1,1", () => {
            test('E', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 2, y: 1 })).toBeCloseTo(E)
            })

            test('NE', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 2, y: 0 })).toBeCloseTo(NE)
            })

            test('N', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 1, y: -0 })).toBeCloseTo(N)
            })

            test('NW', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 0, y: 0 })).toBeCloseTo(NW)
            })

            test('W', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 0, y: 1 })).toBeCloseTo(W)
            })

            test('SW', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 0, y: 2 })).toBeCloseTo(SW)
            })

            test('S', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 1, y: 2 })).toBeCloseTo(S)
            })

            test('SE', () => {
                expect(gameEngine.getDirection({ x: 1, y: 1 }, { x: 2, y: 2 })).toBeCloseTo(SE)
            })
        })
    })

    describe("calculateAutoDirection", () => {

        test('E to NE', () => {
            expect(gameEngine.calculateDirectionAcceleration(E, NE)).toBe(LEFT)
        })

        test('E to NW', () => {
            expect(gameEngine.calculateDirectionAcceleration(E, NW)).toBe(LEFT)
        })

        test('E to E', () => {
            expect(gameEngine.calculateDirectionAcceleration(E, E)).toBe(0)
        })

        test('E to W', () => {
            expect(gameEngine.calculateDirectionAcceleration(E, W)).toBe(LEFT)
        })

        test('N to N', () => {
            expect(gameEngine.calculateDirectionAcceleration(N, N)).toBe(0)
        })

        test('E to SE', () => {
            expect(gameEngine.calculateDirectionAcceleration(E, SE)).toBe(RIGHT)
        })

        test('E to S', () => {
            expect(gameEngine.calculateDirectionAcceleration(E, S)).toBe(RIGHT)
        })

        test('N to SE', () => {
            expect(gameEngine.calculateDirectionAcceleration(N, SE)).toBe(RIGHT)
        })

        test('N to SW', () => {
            expect(gameEngine.calculateDirectionAcceleration(N, SW)).toBe(LEFT)
        })

        test('W to NE', () => {
            expect(gameEngine.calculateDirectionAcceleration(W, NE)).toBe(RIGHT)
        })

        test('W to SE', () => {
            expect(gameEngine.calculateDirectionAcceleration(W, SE)).toBe(LEFT)
        })

        test('S to S', () => {
            expect(gameEngine.calculateDirectionAcceleration(S, S)).toBe(0)
        })

    })

    describe("actions", () => {
        beforeEach(() => {
            gameEngine.createCharacter({ id: '1', x: 0, y: 0 })
        })
        describe("move", () => {

            describe("when starting facing north/up", () => {
                beforeEach(() => {
                    gameEngine.createCharacter({ id: '1', x: 0, y: 0 })
                    gameEngine.updateCharacter({ id: '1', direction: Math.PI / 2 })
                })

                test('should keep going straight', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 0, y: 40 } }] })
                    let u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(N)
                    expect(u?.directionAcceleration).toBe(0)
                    gameEngine.step(2000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(N)
                })

                test('should turn NW', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(LEFT)
                    gameEngine.step(1 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBeCloseTo(NW)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })

            })

            describe("when starting facing east/right", () => {

                test('should keep going straight', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: 0 } }] })
                    let u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(E)
                    expect(u?.directionAcceleration).toBe(0)
                    gameEngine.step(2000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(E)
                })

                test('should turn NE/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(LEFT)
                    gameEngine.step(1 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(NE)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })

                test('should turn N/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 0, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(LEFT)
                    gameEngine.step(2 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(N)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })

                test('should turn NW/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(LEFT)
                    gameEngine.step(3 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBeCloseTo(NW)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })

                test('should turn W/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: 0 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(LEFT)
                    gameEngine.step(4 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBeCloseTo(W)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })

                test('should turn SW/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: 40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(RIGHT)
                    gameEngine.step(3 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(SW)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })

                test('should turn S/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 0, y: 40 } }] })
                    console.log('step 1')
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(RIGHT)
                    console.log('step 2')
                    gameEngine.step(2 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(S)
                    console.log('step 3')
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })

                test('should turn SE/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: 40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(RIGHT)
                    gameEngine.step(1 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.direction).toBe(SE)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.directionAcceleration).toBe(0)
                })
            })
        })
    })

    describe('movement', () => {

        test('should not move if speed and acceleration are 0', () => {
            const c = new Character({ speed: 0, speedAcceleration: 0 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1000, 0)
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
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
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.x).toBe(5)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(0)
            expect(nc.speedAcceleration).toBe(0)
        })

        test('should run straight forward at 5ft per second', () => {
            const c = new Character({ speed: 30, speedAcceleration: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.x).toBe(5)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(30)
            expect(nc.speedAcceleration).toBe(1)
        })

        test('should sprint straight forward at 10ft per second', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 2 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.x).toBe(10)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(60)
            expect(nc.speedAcceleration).toBe(1)
        })

        test('should accelerate from not moving to running in 600ms', () => {
            const c = new Character({ speedAcceleration: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
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
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.x).toBe(0)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(40)

            gameEngine.step(200, 400)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0]

            expect(nc.x).toBeCloseTo(1.333)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(60)

            gameEngine.step(100, 600)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0]

            expect(nc.x).toBeCloseTo(2.333)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(60)

        })

        test('should gradutally go from 60 to 30 when transitioning from sprinting to running', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(1, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.x).toBe(.01)
            expect(nc.y).toBe(0)
            expect(nc.speed).not.toBe(30)
        })

        test('should do 60 to 0 in .6 seconds and 6ft', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 1 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.x).toBe(6)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(0)
        })

        test('should do 60 to 0 in .6 seconds and 6ft', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 2 })
            gameEngine.updateCharacters([c])
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.x).toBe(6)
            expect(nc.y).toBe(0)
            expect(nc.speed).toBe(0)
        })

        test('should turn 180 degrees in 1 second', () => {
            const c = new Character({ directionAcceleration: RIGHT })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.direction).toBe(0)
            //move the character
            gameEngine.step(1000, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            //check the characters position
            expect(nc.direction).toBe(W)
        })

        test('should turn 360 degrees in 2 second', () => {
            const c = new Character({ directionAcceleration: RIGHT })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.direction).toBe(0)
            //move the character
            gameEngine.step(2000, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            //check the characters position
            expect(nc.direction).toBe(E)
        })

        test('should turn 90 degrees to the right in half a second', () => {
            const c = new Character({ directionAcceleration: RIGHT })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.direction).toBe(E)
            //move the character
            gameEngine.step(500, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            //check the characters position
            expect(nc.direction).toBe(S)
        })
        test('should turn 90 degrees to the left in half a second', () => {
            const c = new Character({ directionAcceleration: LEFT })
            gameEngine.updateCharacters([c])
            let nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            expect(nc.direction).toBe(E)
            //move the character
            gameEngine.step(500, 0)
            nc = gameEngine.gameWorld.getCharacters([c.id])[0]
            //check the characters position
            expect(nc.direction).toBe(N)
        })


    })
    describe('speed', () => {

    })


})