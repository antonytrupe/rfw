import GameEngine from "@/GameEngine";
import Point from "./Point";
import Character from "./Character";

export type Action = MoveAction | AttackAction | FollowAction | GatherFoodAction | EatFoodAction
export type Actions = Action[]

type BaseAction = {
    type: string
    id?: string
    //engine: GameEngine
    //character: Character
    repeat?: boolean
    cycle?: boolean
    delay?: number
    turn?: number
    do?: () => {}
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

export class FollowAction implements BaseAction {
    constructor({ engine }) {
        this.engine = engine
    }
    character: Character
    type: 'follow'
    engine: GameEngine
    distance: boolean;
    targetId?: string
    turn: number
    do() {
        //return this.engine.eat()
        console.log('follow')
        return null
    }
}

export class GatherFoodAction implements BaseAction {
    constructor({ engine }) {
        this.engine = engine
    }
    character: Character
    type: 'gatherFood'
    engine: GameEngine
    repeat?: boolean
    cycle?: boolean
    delay: number
    turn: number
    do() {
        //return this.engine.eat()
        console.log('gatherFood')
        return null
    }
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
        console.log('eatFood')
        return null
    }
} 