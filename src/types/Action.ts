import  Point   from "./Point";

export class Action {
    action: string = ''
    targetId?: string = ''
    location?: Point
    repeat?: boolean = false
    cycle?: boolean = false
}