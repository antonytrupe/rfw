import GameEngine from "./GameEngine"
import EventEmitter from "events"
import ExhaustionAction from "./types/actions/ExhaustionAction"
import BaseAction, { Action, CONTINUOUS } from "./types/actions/Action"
import Character from "./types/Character"
import MoveAction from "./types/actions/MoveAction"

describe('adding actions', () => {
    let gameEngine: GameEngine
    let eventEmitter: EventEmitter
    beforeEach(() => {
        const fps = 1
        eventEmitter = new EventEmitter()
        gameEngine = new GameEngine({ fps }, eventEmitter)

    })

    test('when we add a character to the engine', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        expect(one.id).toBe('one')
        expect(gameEngine.getAllCharacters().size).toBe(1)
    })

    test('when we add an action to a character', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        expect(one.id).toBe('one')
        expect(gameEngine.getAllCharacters().size).toBe(1)

        one.addAction(gameEngine, new ExhaustionAction({ engine: gameEngine, character: one }))
        expect(one.actions.length).toBe(1)
        expect(gameEngine.getActiveCharacters().size).toBe(1)
        expect(gameEngine.getActiveCharacters().has(14400)).toBeTruthy()
        expect(gameEngine.getActiveCharacters().get(14400).size).toBe(1)
        expect(gameEngine.getActiveCharacters().get(14400).has("one")).toBeTruthy()
    })


    test('when we add a MoveAction to a character', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        expect(one.id).toBe('one')
        expect(gameEngine.getAllCharacters().size).toBe(1)

        one.addAction(gameEngine, new MoveAction({ engine: gameEngine, character: one, action: { rotationSpeed: 1 } }))
        expect(one.actions.length).toBe(1)
        expect(gameEngine.getActiveCharacters().size).toBe(1)
        //console.log(gameEngine.getActiveCharacters())
        console.log(Array.from(gameEngine.getActiveCharacters().keys()))
        expect(Array.from(gameEngine.getActiveCharacters().keys())).toEqual([CONTINUOUS])
        expect(gameEngine.getActiveCharacters().has(CONTINUOUS)).toBeTruthy()
        expect(gameEngine.getActiveCharacters().get(CONTINUOUS).size).toBe(1)
        expect(gameEngine.getActiveCharacters().get(CONTINUOUS).has("one")).toBeTruthy()
    })


})



describe('single player game', () => {
    let gameEngine: GameEngine
    let eventEmitter: EventEmitter

    beforeEach(() => {
        const fps = 1
        eventEmitter = new EventEmitter()
        gameEngine = new GameEngine({ fps }, eventEmitter)

    })

    test('world starts with a single character', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        expect(one.id).toBe('one')
        expect(gameEngine.getAllCharacters().size).toBe(1)
    })

    test.skip('should have an active character a day from now', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        const activeCharacters = gameEngine.getActiveCharacters()
        console.log(activeCharacters)
        expect(activeCharacters.get(14400).size).toBe(1)
        expect(activeCharacters.get(14400).has('one')).toBeTruthy()
    })


    test('engine starts correct timestamp', () => {
        expect(gameEngine.createTime).toBeCloseTo(new Date().getTime(), -1)
    })

    test('engine starts at turn 0', () => {
        expect(gameEngine.currentTurn).toBe(0)
    })

    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = 24 * hour

    test('when 6 seconds pass', () => {
        gameEngine.step(6 * second, new Date().getTime() + (6 * second))
        expect(gameEngine.currentTurn).toBe(1)
    })

    test('when 1 minute passes', () => {
        gameEngine.step(minute, new Date().getTime() + (minute))
        expect(gameEngine.currentTurn).toBe(10)
    })

    test('when 1 hour passes', () => {
        gameEngine.step(hour, new Date().getTime() + (hour))
        expect(gameEngine.currentTurn).toBe(600)
    })

    test('when a day passes', () => {
        gameEngine.step(day, new Date().getTime() + day)
        expect(gameEngine.currentTurn).toBe(14400)
    })

    test.skip('character should have an exhaustion action', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        const a = one.actions.find((action): action is ExhaustionAction => action.type === 'exhaustion')
        expect(a.type).toBe('exhaustion')
        expect(a.exhaustionLevel).toBe(0)
    })

    test.skip('when a day has passed without rest', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        let a = one.actions.find((action): action is ExhaustionAction => action.type == 'exhaustion')
        expect(a.type).toBe('exhaustion')
        expect(a.exhaustionLevel).toBe(0)

        gameEngine.step(day + minute, gameEngine.createTime + day + minute)
        expect(gameEngine.currentTurn).toBe(14410)
        a = one.actions.find((action): action is ExhaustionAction => action.type == 'exhaustion')
        expect(a.exhaustionLevel).toBe(1)

    })

    test('an action that happens continuously/every step', () => {
        const one = new Character({ id: "one" })

        class FakeAction extends BaseAction {
            steps: number = 0
            sum: number = 0
            type: "continuous"
            do({ engine, character, dt, now }): void {
                this.steps++
                this.sum += dt
            }
            constructor({ engine, character, action }: {
                engine: GameEngine;
                character: Character;
                action: Partial<Action>;
            }) {
                super({ engine, character, action })
                //@ts-ignore
                character.actions = [...character.actions, this]
                this.turn = CONTINUOUS
            }
        }

        //@ts-ignore
        one.addAction(gameEngine, new FakeAction({ engine: gameEngine, character: one, action: {} }))

        //console.log(one)
        //gameEngine.getCharacter('one')
        expect(one.actions.length).toBe(1)

        //@ts-ignore
        let a: FakeAction = one.actions[0]
        //console.log(a)
        //expect(a.type).toBe('continuous')
        expect(a.steps).toBe(0)
        expect(a.sum).toBe(0)

        gameEngine.step(day + minute, gameEngine.createTime + day + minute)
        expect(gameEngine.currentTurn).toBe(14410)
        expect(a.steps).toBe(1)
        expect(a.sum).toBe(day + minute)

    })

    test('an action that happens continuously/every step with the game engine running', async () => {
        const one = new Character({ id: "one" })

        class FakeAction extends BaseAction {
            steps: number = 0
            sum: number = 0
            type: "continuous"
            do({ engine, character, dt, now }): void {
                this.steps++
                this.sum += dt
            }
            constructor({ engine, character, action }: {
                engine: GameEngine;
                character: Character;
                action: Partial<Action>;
            }) {
                super({ engine, character, action })
                //@ts-ignore
                character.actions = [...character.actions, this]
                this.turn = CONTINUOUS
            }
        }

        //@ts-ignore
        one.addAction(gameEngine, new FakeAction({ engine: gameEngine, character: one, action: {} }))

        //console.log(one)
        //gameEngine.getCharacter('one')
        expect(one.actions.length).toBe(1)

        //@ts-ignore
        let a: FakeAction = one.actions[0]
        //console.log(a)
        //expect(a.type).toBe('continuous')
        expect(a.steps).toBe(0)
        expect(a.sum).toBe(0)

        gameEngine.start()

        expect(gameEngine.currentTurn).toBe(0)
        expect(a.steps).toBe(0)
        expect(a.sum).toBe(0)

        //wait a while and make sure the action was processed a bunch
        await new Promise((r) => setTimeout(r, 10000));

        expect(gameEngine.currentTurn).toBeGreaterThan(0)
        expect(a.steps).toBeGreaterThanOrEqual(7)
        expect(a.sum).toBeGreaterThan(6000)

    }, 11000)

    test.skip('when a step is so big it missed an exhaustion action', () => {
        const one = gameEngine.createCharacter({ id: 'one' }).getCharacter('one')
        let a = one.actions.find((action): action is ExhaustionAction => action.type == 'exhaustion')
        expect(a.type).toBe('exhaustion')
        expect(a.exhaustionLevel).toBe(0)
        expect(a.lastRestTurn).toBe(0)
        expect(a.turn).toBe(14400)

        const start = gameEngine.createTime

        expect(gameEngine.currentTurn).toBe(0)

        console.log('day one')
        gameEngine.step(day + minute, start + day + minute)
        expect(gameEngine.currentTurn).toBe(14410)
        a = one.actions.find((action): action is ExhaustionAction => action.type == 'exhaustion')
        expect(a.lastRestTurn).toBe(0)
        expect(a.exhaustionLevel).toBe(1)
        expect(a.turn).toBe(28800)
        expect(gameEngine.getActiveCharacters().get(28800).has('one')).toBeTruthy()

        console.log('day two')
        gameEngine.step(day + minute, start + day + minute + day + minute)
        expect(gameEngine.currentTurn).toBe(28820)
        a = one.actions.find((action): action is ExhaustionAction => action.type == 'exhaustion')
        expect(a.lastRestTurn).toBe(0)
        expect(a.exhaustionLevel).toBe(2)
        expect(a.turn).toBe(43200)
    })

})