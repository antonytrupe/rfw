import GameEngine from "@/GameEngine"
import Point from "./Point"
import Character from "./Character"

export type Action = MoveAction | AttackAction | FollowAction | ForageAction | EatAction
export type Actions = Action[]



export class BaseAction {
    constructor({
        delay, repeat, turn }) {
        this.delay = delay
        this.turn = turn
        this.repeat = repeat
    }
    type: string
    complete: boolean = false
    repeat?: boolean
    delay?: number
    turn: number
    do(character: Character, engine: GameEngine) {
        console.log('base action do', character.name)
        return null
    }
    init(engine: GameEngine, character: Character) {
        console.log('base action init', character.name)
        engine.addActiveCharacter(this.turn, character.id)
    }
}

export class MoveAction extends BaseAction {
    constructor({ delay = 0, location, turn }) {
        super({ delay, repeat: true, turn })
        this.location = location
    }
    type: 'move' = 'move'
    location?: Point
    do(character: Character, engine: GameEngine) {
        //console.log('move')
        return null
    }
}

export class AttackAction extends BaseAction {
    constructor({ targetId,
        triggerSocialAgro,
        triggerSocialAssist,
        delay, turn
    }) {
        super({ delay, repeat: true, turn })
        this.targetId = targetId
        this.triggerSocialAgro = triggerSocialAgro
        this.triggerSocialAssist = triggerSocialAssist
    }
    type: 'attack' = 'attack'
    triggerSocialAgro: boolean
    triggerSocialAssist: boolean
    targetId?: string
    do() {
        console.log('attack action do')
        return null
    }
    init(engine: GameEngine, character: Character) {
        console.log('attack action init')
        character.target = this.targetId
        const actions = [...character.actions.filter((action) => { return action.type != 'attack' }), this]
        character.actions = actions

        super.init(engine, character)
    }
}

class FollowAction extends BaseAction {
    constructor({ targetId, distance, delay, turn }) {
        super({ delay, repeat: true, turn })
        this.targetId = targetId
        this.distance = distance
    }
    type: 'follow' = 'follow'
    distance: boolean
    targetId?: string
    do() {
        //return this.engine.eat()
        console.log('follow')
        return null
    }
}

export class ForageAction extends BaseAction {
    constructor({ delay, turn }) {
        super({ delay, repeat: true, turn })
    }
    type: 'forage' = 'forage'
    do() {
        //return this.engine.eat()
        console.log('forage')
        return null
    }
}

class EatAction extends BaseAction {
    constructor({ delay, turn }) {
        super({ delay, repeat: true, turn })
    }
    type: 'eat' = 'eat'
    do() {
        //return this.engine.eat()
        console.log('eatFood')
        return null
    }
} 