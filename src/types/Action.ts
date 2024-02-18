import Point from "./Point";

export type Action = MoveAction | AttackAction | FollowAction
export type Actions = Action[]
type BaseAction = {
    type: string
    repeat?: boolean
    cycle?: boolean
    delay: number
    turn: number
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