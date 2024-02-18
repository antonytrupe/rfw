import GameEngine from "@/GameEngine";
import Point from "./Point";
import Character from "./Character";

export type Action = MoveAction | AttackAction | FollowAction
export type Actions = Action[]
type BaseAction = {
    type: string
    //engine: GameEngine
    //character: Character
    repeat?: boolean
    cycle?: boolean
    delay: number
    turn: number
    //do: () => {}
}

type MoveAction = BaseAction & {
    type: 'move'
    location?: Point
}

export type AttackAction = BaseAction & {
    type: 'attack'
    triggerSocialAgro: boolean;
    triggerSocialAssist: boolean;
    targetId?: string
}

export type FollowAction = BaseAction & {
    type: 'follow'
    distance: boolean;
    targetId?: string
}

export type GatherFoodAction = BaseAction & {
    type: 'gatherFood'
}

export class EatFoodAction implements BaseAction {
    constructor({ engine }) {
        this.engine = engine
    }
    character: Character
    type: 'eatFood'
    engine: GameEngine
    repeat?: boolean
    cycle?: boolean
    delay: number
    turn: number
    do() {
        //return this.engine.eat()
        return null
    }

} 