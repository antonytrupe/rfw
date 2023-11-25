import { Point } from "./Point"

export default class WorldObject implements WorldObjectInterface {
    id: string = '__test__'
    location: Point = { x: 0, y: 0 }
    rotation: number = 0
    shape: SHAPE = SHAPE.CIRCLE
    radius: number = 1
    length: number = 1
    width: number = 1
    points: Point[] = []
    subObjects: Object[] = []

    constructor({ radius=1 }: WorldObjectInterface) {
        this.radius = radius
    }
}

interface WorldObjectInterface {
    id?: string
    location?: Point
    rotation?: number
    shape?: SHAPE
    radius?: number
    length?: number
    width?: number
    points?: Point[]
    subObjects?: Object[]
}

export enum SHAPE {
    CIRCLE = 'CIRCLE',
    RECT = 'RECT',
    TRIANGLE = 'TRIANGLE',
    POLY = 'POLY',
    COMPOSITE = 'COMPOSITE'
}