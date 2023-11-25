import { Point } from "./Point"
import { ZONETYPE } from "./ZONETYPE"
import { SHAPE } from "./SHAPE"

export default class WorldObject implements WorldObjectInterface {
    id: string = '__test__'
    location: Point = { x: 0, y: 0 }
    rotation: number = 0
    shape: SHAPE = SHAPE.CIRCLE
    radius: number = 1
    width: number = 1
    height: number = 1
    points: Point[] = []
    subObjects: WorldObject[] = []
    zoneType: ZONETYPE[] = [ZONETYPE.TACTICAL]

    constructor({ id = '__test__',
        location = { x: 0, y: 0 },
        rotation = 0,
        shape = SHAPE.CIRCLE,
        radius = 1,
        height = 1,
        width = 1,
        points = [],
        subObjects = [],
        zoneType = [ZONETYPE.TACTICAL] }: WorldObjectInterface) {
        this.id = id
        this.location = location
        this.rotation = rotation
        this.shape = shape
        this.radius = radius
        this.height = height
        this.width = width
        this.points = points
        this.subObjects = subObjects
        this.zoneType = zoneType
    }
}

interface WorldObjectInterface {
    id?: string
    location?: Point
    rotation?: number
    shape?: SHAPE
    radius?: number
    height?: number
    width?: number
    points?: Point[]
    subObjects?: WorldObject[]
    zoneType?: ZONETYPE[]
}