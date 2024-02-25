import GameEngine from "@/GameEngine"
import Point from "@/types/Point"
import Character from "@/types/Character"
import { clamp } from "@/utility"
import AttackAction from "./AttackAction"
import MoveToAction from "./MoveAction"

export type Action = MoveToAction | AttackAction | FollowAction | ForageAction | EatAction | DyingAction
export type Actions = Action[]

export default class BaseAction {
    /**
     * extending classes must add the action to the character
     * @param {GameEngine,character}
     */
    constructor({ engine, character }: { engine: GameEngine, character: Character }) {
        this.turn = engine.currentTurn + 1
    }
    type: string
    complete: boolean = false
    turn: number

    do({ engine, character }: { engine: GameEngine, character: Character }) {
        console.log('base action do', character.name)
    }
}

class FollowAction extends BaseAction {
    constructor({ engine, character, targetId, distance }) {
        super({ engine, character })
        this.targetId = targetId
        this.distance = distance
        this.turn = engine.currentTurn

    }
    type: 'follow' = 'follow'
    distance: boolean
    targetId?: string
    do({ engine, character }: { engine: GameEngine, character: Character }) {
        //return this.engine.eat()
        console.log('follow')
        return null
    }
}

export class ForageAction extends BaseAction {
    constructor({ engine, character, }) {
        super({ engine, character })
        this.turn = engine.currentTurn
    }
    type: 'forage' = 'forage'
    do({ engine, character }: { engine: GameEngine, character: Character }) {
        //return this.engine.eat()
        console.log('forage')
        return null
    }
}

class EatAction extends BaseAction {
    constructor({ engine, character }) {
        super({ engine, character })
    }
    type: 'eat' = 'eat'
    do() {
        //return this.engine.eat()
        console.log('eatFood')
        return null
    }
}

class DyingAction extends BaseAction {
    constructor({ engine, character }: { engine: GameEngine, character: Character }) {
        super({ engine, character })
        this.turn = engine.currentTurn + 1
    }
    type: 'dying' = 'dying'
    do({ engine, character }: { engine: GameEngine, character: Character }) {
        if (!this.complete) {
            console.log('dying')
            if (character.hp < 0 && character.hp > -10) {
                //loose another hp
                //add an event
                character.events.push({ target: character!.id, type: 'attack', amount: 1, time: new Date().getTime() })
                engine.updateCharacter({ id: character.id, hp: clamp(character.hp - 1, -10, character.hp) })
            }
            //TODO add this action to the next turn
            character.addAction(engine, new DyingAction({ engine, character }))
            this.complete = true
        }
    }
} 