import EventEmitter from "events"
import GameEngine from "./GameEngine"
import Character from "./types/Character"


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
        gameEngine.createCharacter({ id: '1', location: { x: 0, y: 0 } })
        gameEngine.createCharacter({ id: '2', location: { x: 0, y: 0 } })
        gameEngine.createCharacter({ id: '3', location: { x: 0, y: 0 } })
        expect(Array.from(gameEngine.gameWorld.getAllCharacters().values()).length).toBe(3)
    })

    describe("getRotationDelta", () => {
        test('E to E', () => {
            expect(gameEngine.getRotationDelta(E, E)).toBeCloseTo(0)
        })
        test('E to NE', () => {
            expect(gameEngine.getRotationDelta(E, NE)).toBe(1 / 4 * Math.PI)
        })
        test('E to N', () => {
            expect(gameEngine.getRotationDelta(E, N)).toBe(2 / 4 * Math.PI)
        })
        test('E to NW', () => {
            expect(gameEngine.getRotationDelta(E, NW)).toBeCloseTo(3 / 4 * Math.PI)
        })
        test('E to W', () => {
            expect(gameEngine.getRotationDelta(E, W)).toBe(4 / 4 * Math.PI)
        })
        test('E to SW', () => {
            expect(gameEngine.getRotationDelta(E, SW)).toBeCloseTo(-3 / 4 * Math.PI)
        })
        test('E to S', () => {
            expect(gameEngine.getRotationDelta(E, S)).toBe(-2 / 4 * Math.PI)
        })
        test('E to SE', () => {
            expect(gameEngine.getRotationDelta(E, SE)).toBeCloseTo(-1 / 4 * Math.PI)
        })

        test('N to E', () => {
            expect(gameEngine.getRotationDelta(N, E)).toBeCloseTo(-2 / 4 * Math.PI)
        })
        test('N to NE', () => {
            expect(gameEngine.getRotationDelta(N, NE)).toBeCloseTo(-1 / 4 * Math.PI)
        })
        test('N to N', () => {
            expect(gameEngine.getRotationDelta(N, N)).toBeCloseTo(0 / 4 * Math.PI)
        })
        test('N to NW', () => {
            expect(gameEngine.getRotationDelta(N, NW)).toBeCloseTo(1 / 4 * Math.PI)
        })
        test('N to W', () => {
            expect(gameEngine.getRotationDelta(N, W)).toBeCloseTo(2 / 4 * Math.PI)
        })
        test('N to SW', () => {
            expect(gameEngine.getRotationDelta(N, SW)).toBeCloseTo(3 / 4 * Math.PI)
        })
        test('N to S', () => {
            expect(gameEngine.getRotationDelta(N, S)).toBeCloseTo(4 / 4 * Math.PI)
        })
        test('N to SE', () => {
            expect(gameEngine.getRotationDelta(N, SE)).toBeCloseTo(-3 / 4 * Math.PI)
        })
    })

    describe("calculateAcceleration", () => {
        let c: Character
        beforeEach(() => {
            c = gameEngine.createCharacter({ id: '1', location: { x: 0, y: 0 }, hp: 1 }).getCharacter("1")!
        })
        describe("facing east", () => {
            test('E', () => {
                expect(gameEngine.calculateAcceleration(c, { x: 6, y: 0 })).toBe(1)
            })
            test('NE', () => {
                expect(gameEngine.calculateAcceleration(c, { x: 6, y: -6 })).toBe(1)
            })
            test('N', () => {
                expect(gameEngine.calculateAcceleration(c, { x: 0, y: -6 })).toBe(0)
            })
            test('NW', () => {
                expect(gameEngine.calculateAcceleration(c, { x: -6, y: -6 })).toBe(0)
            })
            test('W', () => {
                expect(gameEngine.calculateAcceleration(c, { x: -6, y: 0 })).toBe(0)
            })
            test('SW', () => {
                expect(gameEngine.calculateAcceleration(c, { x: -6, y: 6 })).toBe(0)
            })
            test('S', () => {
                expect(gameEngine.calculateAcceleration(c, { x: 0, y: 6 })).toBe(0)
            })
            test('SE', () => {
                expect(gameEngine.calculateAcceleration(c, { x: 6, y: 1 })).toBe(1)
            })

        })
    })

    describe("getRotation", () => {
        describe("from origin", () => {
            test('E', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(E)
            })

            test('NE', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: 1, y: -1 })).toBeCloseTo(NE)
            })

            test('N', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: 0, y: -1 })).toBeCloseTo(N)
            })

            test('NW', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: -1, y: -1 })).toBeCloseTo(NW)
            })

            test('W', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(W)
            })

            test('SW', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: -1, y: 1 })).toBeCloseTo(SW)
            })

            test('S', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(S)
            })

            test('SE', () => {
                expect(gameEngine.getRotation({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(SE)
            })
        })

        describe("from 1,1", () => {
            test('E', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 2, y: 1 })).toBeCloseTo(E)
            })

            test('NE', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 2, y: 0 })).toBeCloseTo(NE)
            })

            test('N', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 1, y: -0 })).toBeCloseTo(N)
            })

            test('NW', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 0, y: 0 })).toBeCloseTo(NW)
            })

            test('W', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 0, y: 1 })).toBeCloseTo(W)
            })

            test('SW', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 0, y: 2 })).toBeCloseTo(SW)
            })

            test('S', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 1, y: 2 })).toBeCloseTo(S)
            })

            test('SE', () => {
                expect(gameEngine.getRotation({ x: 1, y: 1 }, { x: 2, y: 2 })).toBeCloseTo(SE)
            })
        })
    })

    describe("calculateAutoRotation", () => {

        test('E to NE', () => {
            expect(gameEngine.calculateRotationAcceleration(E, NE)).toBe(LEFT)
        })

        test('E to NW', () => {
            expect(gameEngine.calculateRotationAcceleration(E, NW)).toBe(LEFT)
        })

        test('E to E', () => {
            expect(gameEngine.calculateRotationAcceleration(E, E)).toBe(0)
        })

        test('E to W', () => {
            expect(gameEngine.calculateRotationAcceleration(E, W)).toBe(LEFT)
        })

        test('N to N', () => {
            expect(gameEngine.calculateRotationAcceleration(N, N)).toBe(0)
        })

        test('E to SE', () => {
            expect(gameEngine.calculateRotationAcceleration(E, SE)).toBe(RIGHT)
        })

        test('E to S', () => {
            expect(gameEngine.calculateRotationAcceleration(E, S)).toBe(RIGHT)
        })

        test('N to SE', () => {
            expect(gameEngine.calculateRotationAcceleration(N, SE)).toBe(RIGHT)
        })

        test('N to SW', () => {
            expect(gameEngine.calculateRotationAcceleration(N, SW)).toBe(LEFT)
        })

        test('W to NE', () => {
            expect(gameEngine.calculateRotationAcceleration(W, NE)).toBe(RIGHT)
        })

        test('W to SE', () => {
            expect(gameEngine.calculateRotationAcceleration(W, SE)).toBe(LEFT)
        })

        test('S to S', () => {
            expect(gameEngine.calculateRotationAcceleration(S, S)).toBe(0)
        })

    })

    describe("actions", () => {
        beforeEach(() => {
            gameEngine.createCharacter({ id: '1', location: { x: 0, y: 0 } })
        })
        describe("move", () => {

            describe("when starting facing north/up", () => {
                beforeEach(() => {
                    gameEngine.createCharacter({ id: '1', location: { x: 0, y: 0 } })
                    gameEngine.updateCharacter({ id: '1', rotation: Math.PI / 2 })
                })

                test('should keep going straight', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 0, y: 40 } }] })
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(N)
                    expect(u?.rotationAcceleration).toBe(0)
                    gameEngine.step(2000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(N)
                })

                test('should turn NW', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBeCloseTo(LEFT)
                    gameEngine.step(1 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBeCloseTo(NW)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })

            })

            describe("when starting facing east/right", () => {

                test('should keep going straight', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: 0 } }] })
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(E)
                    expect(u?.rotationAcceleration).toBe(0)
                    gameEngine.step(2000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(E)
                })

                test('should turn NE/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(LEFT)
                    gameEngine.step(1 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(NE)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })

                test('should turn N/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 0, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(LEFT)
                    gameEngine.step(2 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(N)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })

                test('should turn NW/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: -40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(LEFT)
                    gameEngine.step(3 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBeCloseTo(NW)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })

                test('should turn W/left', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: 0 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(LEFT)
                    gameEngine.step(4 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBeCloseTo(W)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })

                test('should turn SW/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: -40, y: 40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(RIGHT)
                    gameEngine.step(3 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(SW)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })

                test('should turn S/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 0, y: 40 } }] })
                    //console.log('step 1')
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(RIGHT)
                    //console.log('step 2')
                    gameEngine.step(2 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(S)
                    //console.log('step 3')
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })

                test('should turn SE/right', () => {
                    gameEngine.updateCharacter({ id: '1', actions: [{ action: 'move', location: { x: 40, y: 40 } }] })
                    gameEngine.step(0, 0)
                    let u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(RIGHT)
                    gameEngine.step(1 / 4 * 1000, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotation).toBe(SE)
                    gameEngine.step(0, 0)
                    u = gameEngine.getCharacter('1')
                    expect(u?.rotationAcceleration).toBe(0)
                })
            })
        })
    })

    describe('movement', () => {

        test('should not move if speed and acceleration are 0', () => {
            const c = new Character({ speed: 0, speedAcceleration: 0 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(1000, 0)
            const nc = gameEngine.getCharacter(c.id)!
            //check the characters position
            expect(nc.location.x).toBe(0)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(0)
            expect(nc.speedAcceleration).toBe(0)
        })

        test('should slow down if moving but acceleration is 0', () => {
            const c = new Character({ speed: 30, speedAcceleration: 0 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(5)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(0)
            expect(nc.speedAcceleration).toBe(0)
        })

        test('should walk straight forward at 5ft per second', () => {
            const c = new Character({ speed: 30, speedAcceleration: 1 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(5)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(30)
            expect(nc.speedAcceleration).toBe(1)
        })

        test('should run straight forward at 10ft per second', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 2 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(1000, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(10)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(60)
            expect(nc.speedAcceleration).toBe(1)
        })

        test('should accelerate from not moving to running in 600ms', () => {
            const c = new Character({ speedAcceleration: 1 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(0)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(30)
        })

        test('should accelerate from not moving to running in 1200ms', () => {
            const c = new Character({ speedAcceleration: 1, mode: 2 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(400, 0)
            //check the characters position
            let nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(0)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(40)

            gameEngine.step(200, 400)
            nc = gameEngine.getCharacter(c.id)!

            expect(nc.location.x).toBeCloseTo(1.333)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(60)

            gameEngine.step(100, 600)
            nc = gameEngine.getCharacter(c.id)!

            expect(nc.location.x).toBeCloseTo(2.333)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(60)

        })

        test('should gradutally go from 60 to 30 when transitioning from running to walking', () => {
            const c = new Character({ speed: 60, speedAcceleration: 1, mode: 1 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(1, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(.01)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).not.toBe(30)
        })

        test('should do 30 to 0 in .6 seconds and 3ft if walking', () => {
            const c = new Character({ speed: 30, speedAcceleration: 0, mode: 1 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(3)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(0)
        })

        test('should do 60 to 0 in .6 seconds and 6ft if walking', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 1 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(6)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(0)
        })

        test('should do 60 to 0 in .6 seconds and 6ft even if running', () => {
            const c = new Character({ speed: 60, speedAcceleration: 0, mode: 2 })
            gameEngine.updateCharacter(c)
            //move the character
            gameEngine.step(600, 0)
            //check the characters position
            const nc = gameEngine.getCharacter(c.id)!
            expect(nc.location.x).toBe(6)
            expect(nc.location.y).toBe(0)
            expect(nc.speed).toBe(0)
        })

        test('should turn 180 degrees in 1 second', () => {
            const c = new Character({ rotationAcceleration: RIGHT })
            gameEngine.updateCharacter(c)
            let nc = gameEngine.getCharacter(c.id)!
            expect(nc.rotation).toBe(0)
            //move the character
            gameEngine.step(1000, 0)
            nc = gameEngine.getCharacter(c.id)!
            //check the characters position
            expect(nc.rotation).toBe(W)
        })

        test('should turn 360 degrees in 2 second', () => {
            const c = new Character({ rotationAcceleration: RIGHT })
            gameEngine.updateCharacter(c)
            let nc = gameEngine.getCharacter(c.id)!
            expect(nc.rotation).toBe(0)
            //move the character
            gameEngine.step(2000, 0)
            nc = gameEngine.getCharacter(c.id)!
            //check the characters position
            expect(nc.rotation).toBe(E)
        })

        test('should turn 90 degrees to the right in half a second', () => {
            const c = new Character({ rotationAcceleration: RIGHT })
            gameEngine.updateCharacter(c)
            let nc = gameEngine.getCharacter(c.id)!
            expect(nc.rotation).toBe(E)
            //move the character
            gameEngine.step(500, 0)
            nc = gameEngine.getCharacter(c.id)!
            //check the characters position
            expect(nc.rotation).toBe(S)
        })
        test('should turn 90 degrees to the left in half a second', () => {
            const c = new Character({ rotationAcceleration: LEFT })
            gameEngine.updateCharacter(c)
            let nc = gameEngine.getCharacter(c.id)!
            expect(nc.rotation).toBe(E)
            //move the character
            gameEngine.step(500, 0)
            nc = gameEngine.getCharacter(c.id)!
            //check the characters position
            expect(nc.rotation).toBe(N)
        })


    })
    describe('speed', () => {

    })


})