import GameEngine from "@/GameEngine"
import { distanceBetweenPoints } from "@/Geometry"
import { roll } from "@/utility"
import Character from "../Character"
import * as LEVELS from "@/types/LEVELS.json"
import BaseAction from "./Action"

export default class ExhaustionAction extends BaseAction {

    constructor({ action }: { action: ExhaustionAction })
    constructor({ engine, character, }: { engine: GameEngine, character: Partial<Character> })
    constructor({ engine, character, action
    }: { engine: GameEngine, character: Character, action: ExhaustionAction }) {
        super({ engine, character, action })
        if (!!engine) {
            this.lastRestTurn = engine.currentTurn
            this.turn = engine.currentTurn + 14400
            this.exhaustionLevel = action?.exhaustionLevel || 0
            const actions = [...character.actions.filter((action: BaseAction) => { return action.type != 'exhaustion' }), this]
            character.actions = actions
        }
    }
    type: 'exhaustion' = 'exhaustion'
    exhaustionLevel: number = 0
    lastRestTurn: number
    do({ engine, character }: { engine: GameEngine, character: Character }) {
        //find the last rest action
        console.log('this.lastRestTurn', this.lastRestTurn)
        console.log('engine.currentTurn', engine.currentTurn)
        console.log('this.turn', this.turn)
        if (this.lastRestTurn <= engine.currentTurn - 14400) {
            console.log('exhaustion')
            console.log(this.exhaustionLevel)
            this.exhaustionLevel += 1
            console.log(this.exhaustionLevel)
            this.turn = this.turn + 14400
            //const actions = [...character.actions.filter((action: BaseAction) => { return action.type != 'exhaustion' })]
            //character.actions = actions
            character.addAction(engine, this)
        }
    }
}