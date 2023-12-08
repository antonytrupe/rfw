import Point from "./Point";

export type Action = MoveAction | AttackAction
export type Actions = Action[]
type BaseAction = {
    repeat?: boolean
    cycle?: boolean
}

type MoveAction = BaseAction & {
    action: 'move'
    location?: Point
}

export type AttackAction = BaseAction & {
    action: 'attack'
    triggerSocialAgro: boolean;
    triggerSocialAssist: boolean;
    targetId?: string
} 