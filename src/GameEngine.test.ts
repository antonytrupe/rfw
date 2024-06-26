import EventEmitter from "events"
import GameEngine from "./GameEngine"
import Character from "./types/Character"
import { calculateRotationAcceleration, getRotationDelta, } from "./Geometry"
import { E, NE, N, NW, W, SW, S, SE, LEFT, RIGHT } from "./types/CONSTANTS"
import MoveAction from "./types/actions/MoveAction"

describe('GameEngine', () => {
    let gameEngine: GameEngine
    let eventEmitter: EventEmitter

    beforeEach(() => {
        console.log('recreate the world')
        const fps = 1
        eventEmitter = new EventEmitter()
        gameEngine = new GameEngine({ fps }, eventEmitter)
        console.log('gameEngine.currentTurn', gameEngine.currentTurn)

    })

    afterEach(() => {
        gameEngine.stop()
    })

    test('true', () => {
        expect(true).toBeTruthy()
    })

    test('should add 3 new chararacters', () => {
        //console.log('should add 3 new chararacters')
        gameEngine.createCharacter({ id: '1', location: { x: 0, y: 0 } })
        gameEngine.createCharacter({ id: '2', location: { x: 0, y: 0 } })
        gameEngine.createCharacter({ id: '3', location: { x: 0, y: 0 } })
        expect(Array.from(gameEngine.gameWorld.getAllCharacters().values()).length).toBe(3)
    })

    describe("calculateAcceleration", () => {
        let c: Character
        let moveAction: MoveAction
        beforeEach(() => {
            c = gameEngine.createCharacter({ id: '1', location: { x: 0, y: 0 }, hp: 1 }).getCharacter("1")
            moveAction = new MoveAction({ engine: gameEngine, character: c, action:{speedAcceleration: 1, rotationSpeed: 0, mode: 1 }})
        })
        describe("when facing east", () => {
            //console.log('facing east')
            //console.log('gameEngine', gameEngine)

            test('true', () => {
                expect(true).toBeTruthy()
            })

            test('when moving east', () => {
                console.log(gameEngine.currentTurn)
                expect(gameEngine.calculateAcceleration(c, moveAction, { x: 6, y: 0 })).toBe(1)
                expect(true)
            })
                    test('NE', () => {
                        console.log(gameEngine.currentTurn)
                        expect(gameEngine.calculateAcceleration(c, moveAction, { x: 6, y: -6 })).toBe(1)
                    })
                    test('N', () => {
                        expect(gameEngine.calculateAcceleration(c, moveAction, { x: 0, y: -6 })).toBe(0)
                    })
                    test('NW', () => {
                        expect(gameEngine.calculateAcceleration(c, moveAction, { x: -6, y: -6 })).toBe(0)
                    })
                    test('W', () => {
                        expect(gameEngine.calculateAcceleration(c, moveAction, { x: -6, y: 0 })).toBe(0)
                    })
                    test('SW', () => {
                        expect(gameEngine.calculateAcceleration(c, moveAction, { x: -6, y: 6 })).toBe(0)
                    })
                    test('S', () => {
                        expect(gameEngine.calculateAcceleration(c, moveAction, { x: 0, y: 6 })).toBe(0)
                    })
                    test('SE', () => {
                        expect(gameEngine.calculateAcceleration(c, moveAction, { x: 6, y: 1 })).toBe(1)
                    })
        })
    })

    describe("calculateAutoRotation", () => {

            test('E to NE', () => {
                expect(calculateRotationAcceleration(E, NE)).toBe(LEFT)
            })

            test('E to NW', () => {
                expect(calculateRotationAcceleration(E, NW)).toBe(LEFT)
            })

            test('E to E', () => {
                expect(calculateRotationAcceleration(E, E)).toBe(0)
            })

            test('E to W', () => {
                expect(calculateRotationAcceleration(E, W)).toBe(LEFT)
            })

            test('N to N', () => {
                expect(calculateRotationAcceleration(N, N)).toBe(0)
            })

            test('E to SE', () => {
                expect(calculateRotationAcceleration(E, SE)).toBe(RIGHT)
            })

            test('E to S', () => {
                expect(calculateRotationAcceleration(E, S)).toBe(RIGHT)
            })

            test('N to SE', () => {
                expect(calculateRotationAcceleration(N, SE)).toBe(RIGHT)
            })

            test('N to SW', () => {
                expect(calculateRotationAcceleration(N, SW)).toBe(LEFT)
            })

            test('W to NE', () => {
                expect(calculateRotationAcceleration(W, NE)).toBe(RIGHT)
            })

            test('W to SE', () => {
                expect(calculateRotationAcceleration(W, SE)).toBe(LEFT)
            })

            test('S to S', () => {
                expect(calculateRotationAcceleration(S, S)).toBe(0)
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

                test.skip('should keep going straight', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: 0, y: 40 } }] })
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(N)
                    // expect(u?.rotationAcceleration).toBe(0)
                    // gameEngine.step(2000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(N)
                })

                test.skip('should turn NW', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: -40, y: -40 } }] })
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBeCloseTo(LEFT)
                    // gameEngine.step(1 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBeCloseTo(NW)
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })

            })

            describe("when starting facing east/right", () => {

                test.skip('should keep going straight', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: 40, y: 0 } }] })
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(E)
                    // expect(u?.rotationAcceleration).toBe(0)
                    // gameEngine.step(2000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(E)
                })

                test.skip('should turn NE/left', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: 40, y: -40 } }] })
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(LEFT)
                    // gameEngine.step(1 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(NE)
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })

                test.skip('should turn N/left', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: 0, y: -40 } }] })
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(LEFT)
                    // gameEngine.step(2 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(N)
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })

                test.skip('should turn NW/left', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: -40, y: -40 } }] })
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(LEFT)
                    // gameEngine.step(3 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBeCloseTo(NW)
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })

                test.skip('should turn W/left', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: -40, y: 0 } }] })
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(LEFT)
                    // gameEngine.step(4 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBeCloseTo(W)
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })

                test.skip('should turn SW/right', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: -40, y: 40 } }] })
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(RIGHT)
                    // gameEngine.step(3 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(SW)
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })

                test.skip('should turn S/right', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: 0, y: 40 } }] })
                    // //console.log('step 1')
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(RIGHT)
                    // //console.log('step 2')
                    // gameEngine.step(2 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(S)
                    // //console.log('step 3')
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })

                test.skip('should turn SE/right', () => {
                    // gameEngine.updateCharacter({ id: '1', actions: [{ type: 'moveTo', location: { x: 40, y: 40 } }] })
                    // gameEngine.step(0, 0)
                    // let u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(RIGHT)
                    // gameEngine.step(1 / 4 * 1000, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotation).toBe(SE)
                    // gameEngine.step(0, 0)
                    // u = gameEngine.getCharacter('1')
                    // expect(u?.rotationAcceleration).toBe(0)
                })
            })
        })
    })

    describe('movement', () => {

        test.skip('should not move if speed and acceleration are 0', () => {
            // const c = new Character({ speed: 0, speedAcceleration: 0 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(1000, 0)
            // const nc = gameEngine.getCharacter(c.id)!
            // //check the characters position
            // expect(nc.location.x).toBe(0)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(0)
            // expect(nc.speedAcceleration).toBe(0)
        })

        test('should slow down if moving but acceleration is 0', () => {
            // const c = new Character({ speed: 30, speedAcceleration: 0 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(1000, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)
            // expect(nc.location.x).toBe(0)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(0)
            // expect(nc.speedAcceleration).toBe(0)
        })

        test('should walk straight forward at 5ft per second', () => {
            // const c = new Character({ speed: 30, speedAcceleration: 1 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(1000, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)!
            // expect(nc.location.x).toBe(5)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(30)
            // expect(nc.speedAcceleration).toBe(1)
        })

        test('should run straight forward at 10ft per second', () => {
            // const c = new Character({ speed: 60, speedAcceleration: 1, mode: 2 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(1000, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)!
            // expect(nc.location.x).toBe(10)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(60)
            // expect(nc.speedAcceleration).toBe(1)
        })

        test('should accelerate from not moving to running in 600ms', () => {
            // const c = new Character({ speedAcceleration: 1 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(600, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)
            // expect(nc.location.x).toBe(1.5)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(30)
        })

        test('should accelerate from not moving to running in 1200ms', () => {
            // const c = new Character({ speedAcceleration: 1, mode: 2 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(400, 0)
            // //check the characters position
            // let nc = gameEngine.getCharacter(c.id)
            // expect(nc.location.x).toBeCloseTo(1.33)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(40)

            // gameEngine.step(200, 400)
            // nc = gameEngine.getCharacter(c.id)

            // expect(nc.location.x).toBeCloseTo(3)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(60)

            // gameEngine.step(100, 600)
            // nc = gameEngine.getCharacter(c.id)

            // expect(nc.location.x).toBeCloseTo(4)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(60)

        })

        test.skip('should gradutally go from 60 to 30 when transitioning from running to walking', () => {
            // const c = new Character({ speed: 60, speedAcceleration: 1, mode: 1 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(1, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)
            // expect(nc.location.x).toBeCloseTo(.01)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).not.toBe(30)
        })

        test('should do 30 to 0 in .6 seconds and 3ft if walking', () => {
            // const c = new Character({ speed: 30, speedAcceleration: 0, mode: 1 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(600, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)
            // expect(nc.location.x).toBe(0)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(0)
        })

        test('should do 60 to 0 in .6 seconds and 6ft if walking', () => {
            // const c = new Character({ speed: 60, speedAcceleration: 0, mode: 1 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(600, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)
            // expect(nc.location.x).toBe(3)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(0)
        })

        test('should do 60 to 0 in .6 seconds and 6ft even if running', () => {
            // const c = new Character({ speed: 60, speedAcceleration: 0, mode: 2 })
            // gameEngine.updateCharacter(c)
            // //move the character
            // gameEngine.step(600, 0)
            // //check the characters position
            // const nc = gameEngine.getCharacter(c.id)
            // expect(nc.location.x).toBe(3)
            // expect(nc.location.y).toBe(0)
            // expect(nc.speed).toBe(0)
        })

        test.skip('should turn 180 degrees in 1 second', () => {
            // const c = new Character({ rotationAcceleration: RIGHT })
            // gameEngine.updateCharacter(c)
            // let nc = gameEngine.getCharacter(c.id)!
            // expect(nc.rotation).toBe(0)
            // //move the character
            // gameEngine.step(1000, 0)
            // nc = gameEngine.getCharacter(c.id)!
            // //check the characters position
            // expect(nc.rotation).toBe(S)
        })

        test.skip('should turn 360 degrees in 2 second', () => {
            // const c = new Character({ rotationAcceleration: RIGHT })
            // gameEngine.updateCharacter(c)
            // let nc = gameEngine.getCharacter(c.id)!
            // expect(nc.rotation).toBe(0)
            // //move the character
            // gameEngine.step(2000, 0)
            // nc = gameEngine.getCharacter(c.id)!
            // //check the characters position
            // expect(nc.rotation).toBe(E)
        })

        test.skip('should turn 90 degrees to the right in half a second', () => {
            // const c = new Character({ rotationAcceleration: RIGHT })
            // gameEngine.updateCharacter(c)
            // let nc = gameEngine.getCharacter(c.id)!
            // expect(nc.rotation).toBe(E)
            // //move the character
            // gameEngine.step(500, 0)
            // nc = gameEngine.getCharacter(c.id)!
            // //check the characters position
            // expect(nc.rotation).toBe(S)
        })
        test.skip('should turn 90 degrees to the left in half a second', () => {
            // const c = new Character({ rotationAcceleration: LEFT })
            // gameEngine.updateCharacter(c)
            // let nc = gameEngine.getCharacter(c.id)!
            // expect(nc.rotation).toBe(E)
            // //move the character
            // gameEngine.step(500, 0)
            // nc = gameEngine.getCharacter(c.id)!
            // //check the characters position
            // expect(nc.rotation).toBe(N)
        })


    })
    describe('speed', () => {

    })


})