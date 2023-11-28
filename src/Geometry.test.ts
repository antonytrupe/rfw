import { E, N, NE, NW, S, SE, SW, W, calculateCollisionPoint, calculateDistanceSegmentPolygon, calculateIntersectionSegmentSegment, calculatePerpendicularPointOnSameSide, calculateRectanglePoints, findClosestPoint, getDistancePointSegment, getDistanceSegmentSegment, getRotation } from "./Geometry"
import Character from "./types/Character"
import LineSegment from "./types/LineSegment"
import Point from "./types/Point"
import { SHAPE } from "./types/SHAPE"
import WorldObject from "./types/WorldObject"

//calculateCollisionPoint
describe("calculateCollisionPoint", () => {
    test('should hit the top of the rectangle', () => {
        const circle = new Character({ location: { x: 0, y: -20 } })
        const end = { x: 0, y: 10 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 2 })

        const newPosition = calculateCollisionPoint(circle, end, rect)
        expect(newPosition?.x).toBe(0)
        expect(newPosition?.y).toBe(-3.5)
    })

    test('should hit the right side of the rectangle', () => {
        const circle = new Character({ location: { x: 20, y: 1 } })
        const end = { x: -10, y: 1 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 4 })

        const newPosition = calculateCollisionPoint(circle, end, rect)
        expect(newPosition?.x).toBe(4.5)
        expect(newPosition?.y).toBe(1)
    })

    test('should hit the right side of the rectangle when not moving', () => {
        const circle = new Character({ location: { x: 20, y: 1 } })
        const end = { x: 1.9, y: 1 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 4 })

        const newPosition = calculateCollisionPoint(circle, end, rect)
        expect(newPosition?.x).toBe(4.5)
        expect(newPosition?.y).toBe(1)
    })

    test('should hit the right side of the rectangle moving at a slight angle', () => {
        //moving at a slight angle
        const circle = new Character({ location: { x: 10, y: 2 } })
        const end = { x: -10, y: 1 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 40 })

        const newPosition = calculateCollisionPoint(circle, end, rect)
        expect(newPosition?.x).toBe(4.5)
        expect(newPosition?.y).toBe(1.6)
    })

    test('should hit the right side of the rectangle moving at a hard angle', () => {
        //moving at a slight angle
        const circle = new Character({ location: { x: 10, y: 2 } })
        const end = { x: -10, y: 20 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 40 })

        const newPosition = calculateCollisionPoint(circle, end, rect)
        expect(newPosition?.x).toBe(4.5)
        expect(newPosition?.y).toBeCloseTo(9.2)
    })
})

describe("calculatePerpendicularPointOnSameSide", () => {
    test('below a horizontal line', () => {
        const segment = { start: { x: -10, y: 0 }, end: { x: 10, y: 0 } }
        const pointOnSegment = { x: 0, y: 0 }
        const pointNotOnSegment = { x: 0, y: 1 }
        const distance = 2.5
        const newPosition = calculatePerpendicularPointOnSameSide(segment, pointOnSegment, pointNotOnSegment, distance)
        expect(newPosition?.x).toBe(0)
        expect(newPosition?.y).toBe(2.5)
    })

    test('above a horizontal line', () => {
        const segment = { start: { x: -10, y: -1 }, end: { x: 10, y: -1 } }
        const pointOnSegment = { x: 0, y: -1 }
        const pointNotOnSegment = { x: 0, y: -2 }
        const distance = 2.5
        const newPosition = calculatePerpendicularPointOnSameSide(segment, pointOnSegment, pointNotOnSegment, distance)
        expect(newPosition?.x).toBe(0)
        expect(newPosition?.y).toBe(-3.5)
    })
    test('to the right of a vertical line', () => {
        const segment = { start: { x: 0, y: -10 }, end: { x: 0, y: 10 } }
        const pointOnSegment = { x: 0, y: 0 }
        const pointNotOnSegment = { x: 10, y: 0 }
        const distance = 2.5
        const newPosition = calculatePerpendicularPointOnSameSide(segment, pointOnSegment, pointNotOnSegment, distance)
        expect(newPosition?.x).toBe(2.5)
        expect(newPosition?.y).toBe(0)
    })
    test('to the left of a vertical line', () => {
        const segment = { start: { x: 0, y: -10 }, end: { x: 0, y: 10 } }
        const pointOnSegment = { x: 0, y: 0 }
        const pointNotOnSegment = { x: -10, y: 0 }
        const distance = 2.5
        const newPosition = calculatePerpendicularPointOnSameSide(segment, pointOnSegment, pointNotOnSegment, distance)
        expect(newPosition?.x).toBe(-2.5)
        expect(newPosition?.y).toBe(0)
    })

    test('above a line running nw to se', () => {
        const segment = { start: { x: -10, y: -10 }, end: { x: 10, y: 10 } }
        const pointOnSegment = { x: 0, y: 0 }
        const pointNotOnSegment = { x: 5, y: -5 }
        const distance = 2.5
        const newPosition = calculatePerpendicularPointOnSameSide(segment, pointOnSegment, pointNotOnSegment, distance)
        expect(newPosition?.x).toBeCloseTo(1.767)
        expect(newPosition?.y).toBeCloseTo(-1.767)
    })
})


describe("findClosestPoint", () => {
    test('should find the closest point', () => {
        const points = [
            { x: 1, y: 5 },
            { x: 1, y: 6 },
            { x: 7, y: 1 },
            { x: 4, y: 4 },
        ]
        const point = { x: 0, y: 0 }

        const closestPoint = findClosestPoint(point, points)
        expect(closestPoint?.x).toBe(1)
        expect(closestPoint?.y).toBe(5)
    })
})

describe("calculateSegmentsIntersection", () => {
    test('chatgpt example', () => {
        const segment1: LineSegment = { start: { x: 1, y: 5 }, end: { x: 5, y: 1 } }
        const segment2: LineSegment = { start: { x: -1, y: 5 }, end: { x: 7, y: 1 } }

        const intersectionPoint = calculateIntersectionSegmentSegment(segment1, segment2)
        expect(intersectionPoint?.x).toBe(3)
        expect(intersectionPoint?.y).toBe(3)
    })

    test('should intersect a rectable at two points when moving down', () => {
        const circle = new Character({ location: { x: 0, y: -20 } })
        //move straight down
        const direction = { x: 0, y: 10 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 2 })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(rect)

        const topIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: direction }, { start: topLeft, end: topRight })
        const leftIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: direction }, { start: bottomLeft, end: topLeft })
        const bottomIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: direction }, { start: bottomRight, end: bottomLeft })
        const rightIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: direction }, { start: topRight, end: bottomRight })

        expect(topIntersection?.x).toBe(0)
        expect(topIntersection?.y).toBe(-1)

        expect(leftIntersection?.x).toBeUndefined()
        expect(leftIntersection?.y).toBeUndefined()

        expect(bottomIntersection?.x).toBe(0)
        expect(bottomIntersection?.y).toBe(1)

        expect(rightIntersection?.x).toBeUndefined()
        expect(rightIntersection?.y).toBeUndefined()
    })

    test('should intersect a rectable at two points when moving horizontal', () => {
        const circle = new Character({ location: { x: -20, y: 0 } })
        //move to the right
        const end = { x: 20, y: 0 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 2 })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(rect)

        const topIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: topLeft, end: topRight })
        const leftIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomLeft, end: topLeft })
        const bottomIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomRight, end: bottomLeft })
        const rightIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: topRight, end: bottomRight })

        expect(topIntersection?.x).toBeUndefined()
        expect(topIntersection?.y).toBeUndefined()

        expect(leftIntersection?.x).toBe(-2)
        expect(leftIntersection?.y).toBeCloseTo(0)

        expect(bottomIntersection?.x).toBeUndefined()
        expect(bottomIntersection?.y).toBeUndefined()

        expect(rightIntersection?.x).toBe(2)
        expect(rightIntersection?.y).toBeCloseTo(0)
    })

    test('should intersect a rectable at two adjacent sides when moving diagonal', () => {
        const circle = new Character({ location: { x: 0, y: -13 } })
        //move diagonal to the right
        const end = { x: 13, y: 0 }
        const rect = new WorldObject({ shape: SHAPE.RECT, width: 20, height: 20 })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(rect)

        expect(topRight.x).toBe(10)
        expect(topRight.y).toBe(-10)
        expect(topLeft.x).toBe(-10)
        expect(topLeft.y).toBe(-10)
        expect(bottomLeft.x).toBe(-10)
        expect(bottomLeft.y).toBe(10)
        expect(bottomRight.x).toBe(10)
        expect(bottomRight.y).toBe(10)

        const topIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: topLeft, end: topRight })
        const leftIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomLeft, end: topLeft })
        const bottomIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomRight, end: bottomLeft })
        const rightIntersection = calculateIntersectionSegmentSegment({ start: circle.location, end: end }, { start: topRight, end: bottomRight })

        expect(leftIntersection?.x).toBeUndefined()
        expect(leftIntersection?.y).toBeUndefined()

        expect(bottomIntersection?.x).toBeUndefined()
        expect(bottomIntersection?.y).toBeUndefined()

        expect(rightIntersection?.x).toBe(10)
        expect(rightIntersection?.y).toBeCloseTo(-3)

        expect(topIntersection?.x).toBeCloseTo(3)
        expect(topIntersection?.y).toBe(-10)
    })
})



describe("calculateRectanglePoints", () => {
    test('should handle a square at the origin', () => {
        const square = new WorldObject({ shape: SHAPE.RECT, width: 2, height: 2 })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(square)
        expect(topRight.x).toBe(1)
        expect(topRight.y).toBe(-1)
        expect(topLeft.x).toBe(-1)
        expect(topLeft.y).toBe(-1)
        expect(bottomLeft.x).toBe(-1)
        expect(bottomLeft.y).toBe(1)
        expect(bottomRight.x).toBe(1)
        expect(bottomRight.y).toBe(1)
    })

    test('should handle a rectangle at the origin', () => {
        const square = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 2 })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(square)
        expect(topRight.x).toBe(2)
        expect(topRight.y).toBe(-1)
        expect(topLeft.x).toBe(-2)
        expect(topLeft.y).toBe(-1)
        expect(bottomLeft.x).toBe(-2)
        expect(bottomLeft.y).toBe(1)
        expect(bottomRight.x).toBe(2)
        expect(bottomRight.y).toBe(1)
    })

    test('should handle a square at the origin rotated 45 degrees', () => {
        const square = new WorldObject({ shape: SHAPE.RECT, width: 2, height: 2, rotation: Math.PI / 4, })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(square)
        expect(topRight.x).toBeCloseTo(0)
        expect(topRight.y).toBeCloseTo(-1.4142)
        expect(topLeft.x).toBeCloseTo(-1.4142)
        expect(topLeft.y).toBeCloseTo(0)
        expect(bottomLeft.x).toBeCloseTo(0)
        expect(bottomLeft.y).toBeCloseTo(1.4142)
        expect(bottomRight.x).toBeCloseTo(1.4142)
        expect(bottomRight.y).toBeCloseTo(0)
    })

    test('should handle a rect at the origin rotated 90 degress', () => {
        const square = new WorldObject({ shape: SHAPE.RECT, width: 10, height: 2, rotation: Math.PI / 2 })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(square)
        expect(topRight.x).toBeCloseTo(-1)
        expect(topRight.y).toBeCloseTo(-5)
        expect(topLeft.x).toBeCloseTo(-1)
        expect(topLeft.y).toBeCloseTo(5)
        expect(bottomLeft.x).toBeCloseTo(1)
        expect(bottomLeft.y).toBeCloseTo(5)
        expect(bottomRight.x).toBeCloseTo(1)
        expect(bottomRight.y).toBeCloseTo(-5)
    })

    test('should handle a rect at the origin rotated 45 degress', () => {
        const square = new WorldObject({ shape: SHAPE.RECT, width: 10, height: 2, rotation: Math.PI / 4 })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(square)
        expect(topRight.x).toBeCloseTo(2.828)
        expect(topRight.y).toBeCloseTo(-4.242)
        expect(topLeft.x).toBeCloseTo(-4.242)
        expect(topLeft.y).toBeCloseTo(2.828)
        expect(bottomLeft.x).toBeCloseTo(-2.828)
        expect(bottomLeft.y).toBeCloseTo(4.242)
        expect(bottomRight.x).toBeCloseTo(4.242)
        expect(bottomRight.y).toBeCloseTo(-2.828)
    })

    test('should handle a rect not at the origin rotated 45 degress', () => {
        const square = new WorldObject({ shape: SHAPE.RECT, width: 10, height: 2, rotation: Math.PI / 4, location: { x: 10, y: 10 } })
        const [topRight, topLeft, bottomLeft, bottomRight] = calculateRectanglePoints(square)
        expect(topRight.x).toBeCloseTo(12.828)
        expect(topRight.y).toBeCloseTo(5.757)
        expect(topLeft.x).toBeCloseTo(5.757)
        expect(topLeft.y).toBeCloseTo(12.828)
        expect(bottomLeft.x).toBeCloseTo(7.171)
        expect(bottomLeft.y).toBeCloseTo(14.242)
        expect(bottomRight.x).toBeCloseTo(14.242)
        expect(bottomRight.y).toBeCloseTo(7.171)
    })
})

describe("getRotation", () => {
    describe("from origin", () => {
        test('E', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(E)
        })

        test('NE', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: 1, y: -1 })).toBeCloseTo(NE)
        })

        test('N', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: 0, y: -1 })).toBeCloseTo(N)
        })

        test('NW', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: -1, y: -1 })).toBeCloseTo(NW)
        })

        test('W', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(W)
        })

        test('SW', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: -1, y: 1 })).toBeCloseTo(SW)
        })

        test('S', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(S)
        })

        test('SE', () => {
            expect(getRotation({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(SE)
        })
    })

    describe("from 1,1", () => {
        test('E', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 2, y: 1 })).toBeCloseTo(E)
        })

        test('NE', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 2, y: 0 })).toBeCloseTo(NE)
        })

        test('N', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 1, y: -0 })).toBeCloseTo(N)
        })

        test('NW', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 0, y: 0 })).toBeCloseTo(NW)
        })

        test('W', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 0, y: 1 })).toBeCloseTo(W)
        })

        test('SW', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 0, y: 2 })).toBeCloseTo(SW)
        })

        test('S', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 1, y: 2 })).toBeCloseTo(S)
        })

        test('SE', () => {
            expect(getRotation({ x: 1, y: 1 }, { x: 2, y: 2 })).toBeCloseTo(SE)
        })
    })
})

describe("calculateDistanceSegmentPolygon", () => {
    test('should beundefined if the polygon has no points', () => {
        const segment: LineSegment = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
        const polygon: Point[] = []
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBeUndefined()
    })
    test('should be 0 when its just two points', () => {
        const segment: LineSegment = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
        const polygon: Point[] = [{ x: 0, y: 0 }]
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBe(0)
    })
    test('should be 0 when its just a point on a line', () => {
        const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
        const polygon: Point[] = [{ x: 0, y: 0 }]
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBe(0)
    })
    test('should be 1 when its just a point off a line', () => {
        const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
        const polygon: Point[] = [{ x: 0, y: 1 }]
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBe(1)
    })
    test('should be 0 when its two segments crossing at the origin', () => {
        const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
        const polygon: Point[] = [{ x: 0, y: -1 }, { x: 0, y: 1 }]
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBe(0)
    })
    test('should be 1 when its two segments not crossing', () => {
        const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
        const polygon: Point[] = [{ x: 0, y: 3 }, { x: 0, y: 1 }]
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBe(1)
    })

    test('should be 2 when its a box and a segment that do not intersect', () => {
        const segment: LineSegment = { start: { x: 3, y: 0 }, end: { x: 4, y: 0 } }
        const polygon: Point[] = [{ x: 1, y: -1 }, { x: -1, y: -1 },{ x: -1, y: 1 }, { x: 1, y: 1 }]
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBe(2)
    })

    test('should be 0 when its a box and a segment that do intersect', () => {
        const segment: LineSegment = { start: { x: 0.8, y: 0 }, end: { x: 4, y: 0 } }
        const polygon: Point[] = [{ x: 1, y: -1 }, { x: -1, y: -1 },{ x: -1, y: 1 }, { x: 1, y: 1 }]
        expect(calculateDistanceSegmentPolygon(segment, polygon)).toBe(0)
    })

})


describe("getDistanceSegmentSegment", () => {
    test('should be 0 when its two segments crossing at the origin', () => {
        const segment1: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
        const segment2: LineSegment = { start: { x: 0, y: -1 }, end: { x: 0, y: 1 } }
        expect(getDistanceSegmentSegment(segment1, segment2)).toBe(0)
    })
    test('should be 1 when its two segments not crossing', () => {
        const segment1: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
        const segment2: LineSegment = { start: { x: 0, y: 3 }, end: { x: 0, y: 1 } }
        expect(getDistanceSegmentSegment(segment1, segment2)).toBe(1)
    })
})

//getDistancePointSegment

describe("getDistancePointSegment", () => {
    test('should be 0 when the point is on the middle of the segment', () => {
        const point: Point = { x: 0, y: 0 }
        const segment: LineSegment = { start: { x: 0, y: -1 }, end: { x: 0, y: 1 } }
        expect(getDistancePointSegment(point, segment)).toBe(0)
    })
    test('should be 0 when the point is on the end of the segment', () => {
        const point: Point = { x: 0, y: 3 }
        const segment: LineSegment = { start: { x: 0, y: 3 }, end: { x: 0, y: 1 } }
        expect(getDistancePointSegment(point, segment)).toBe(0)
    })
    test('should be 7 when the point is above the segment', () => {
        const point: Point = { x: -1, y: -6 }
        const segment: LineSegment = { start: { x: -10, y: 1 }, end: { x: 10, y: 1 } }
        expect(getDistancePointSegment(point, segment)).toBe(7)
    })
 



})