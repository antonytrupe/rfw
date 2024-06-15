import GameEngine from "@/GameEngine"
import Character from "@/types/Character"
import { clamp } from "@/utility"
import AttackAction from "./AttackAction"
import MoveToAction from "./MoveToAction"
import MoveAction from "./MoveAction"
import ExhaustionAction from "./ExhaustionAction"

export type Action = MoveToAction | AttackAction | FollowAction | ForageAction | EatAction | DyingAction | MoveAction | ExhaustionAction
export type Actions = Action[]
export const CONTINUOUS = 0

export default class BaseAction {
    type: string
    //complete: boolean = false
    turn: number

    //constructor({ action }: { action: Action })
    //constructor({ engine, character }: { engine: GameEngine, character: Character })
    /**
     * extending classes must add the action to the character
     * @param {GameEngine,character}
     */
    constructor({ engine, character, action }: { engine: GameEngine, character: Character, action: Partial<Action> }) {
        if (!!engine) {
            this.turn = engine.currentTurn + 1
        } if (!!action) {
            Object.assign(this, action)
        }
    }

    do({ engine, character }: { engine: GameEngine, character: Character }) {
        console.log('base action do', character.name)
    }
}

export class FollowAction extends BaseAction {
    type: 'follow' = 'follow'
    distance: boolean
    targetId?: string

    constructor({ action }: { action: Action })
    constructor({ engine, character }: { engine: GameEngine, character: Character })
    constructor({ engine, character, action, targetId, distance }) {
        super({ engine, character, action })
        if (!!targetId) {
            this.targetId = targetId
        }
        if (!!distance) {
            this.distance = distance
        }
        if (!!engine) {
            this.turn = engine.currentTurn
        }
    }

    do({ engine, character }: { engine: GameEngine, character: Character }) {
        //return this.engine.eat()
        console.log('follow')
        return null
    }
}

export class ForageAction extends BaseAction {
    type: 'forage' = 'forage'
    constructor({ action }: { action: Action })
    constructor({ engine, character }: { engine: GameEngine, character: Character })
    constructor({ engine, character, action }) {
        super({ engine, character, action })
        if (!!engine) {
            this.turn = engine.currentTurn + 1
        }
        if (!!character) {
            //add the action to the front of the array
            character.actions.splice(0, 0, this)
        }
    }

    do({ engine, character }: { engine: GameEngine, character: Character }) {
        //console.log('this.turn', this.turn)
        //console.log('engine.currentTurn', engine.currentTurn)
        if (this.turn != engine.currentTurn) {
            return
        }
        console.log('forage', character.name, this.turn)
        //remove the current forage 
        character.actions = character.actions.filter(a => a.type != 'forage' || a.turn > engine.currentTurn)
        //and add the next turn's forage
        engine.addForageAction(character.id)
    }
}

export class EatAction extends BaseAction {
    type: 'eat' = 'eat'

    constructor({ action }: { action: Action })
    constructor({ engine, character }: { engine: GameEngine, character: Character })
    constructor({ engine, character, action }) {
        super({ engine, character, action })
    }

    do() {
        //return this.engine.eat()
        console.log('eatFood')
        return null
    }
}

export class DyingAction extends BaseAction {
    type: 'dying' = 'dying'

    constructor({ action }: { action: Action })
    constructor({ engine, character }: { engine: GameEngine, character: Character })
    constructor({ engine, character, action }: { engine: GameEngine, character: Character, action: Action }) {
        super({ engine, character, action })
        if (!!engine) {
            this.turn = engine.currentTurn + 1
        }
    }

    do({ engine, character }: { engine: GameEngine, character: Character }) {
        console.log('dying')
        if (character.hp < 0 && character.hp > -10) {
            //loose another hp
            //add an event
            character.events.push({ target: character!.id, type: 'attack', amount: 1, time: new Date().getTime() })
            engine.updateCharacter({ id: character.id, hp: clamp(character.hp - 1, -10, character.hp) })
        }

        character.actions = character.actions.filter(a => a.type != 'dying' || a.turn > engine.currentTurn)

        //TODO add this action to the next turn
        character.addAction(engine, new DyingAction({ engine, character }))
    }
}