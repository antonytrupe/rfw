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

    constructor({ id = '__test__',
        location = { x: 0, y: 0 },
        rotation = 0,
        shape = SHAPE.CIRCLE,
        radius = 1,
        length = 1,
        width = 1,
        points = [],
        subObjects = [] }: WorldObjectInterface) {
        this.id = id
        this.location = location
        this.rotation = rotation
        this.shape = shape
        this.radius = radius
        this.length = length
        this.width = width
        this.points = points
        this.subObjects = subObjects
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