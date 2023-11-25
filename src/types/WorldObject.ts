import { Point } from "./Point"

enum SHAPE {
    CIRCLE,
    RECT,
    TRIANGLE
}

export class WorldObject {
    id: string = '__test__'
    location: Point = { x: 0, y: 0 }
    rotation: number = 0
    shape: SHAPE = SHAPE.CIRCLE
    subObjects: Object[] = []
}