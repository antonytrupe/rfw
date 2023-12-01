import { E, N, NE, NW, S, SE, SW, W, polygonSlide, distanceSegmentPolygon, intersectionSegmentSegment, rectanglePoints, distancePointSegment, distanceSegmentSegment, getRotation, extendSegment, intersectionLineLine } from "./Geometry"
import Character from "./types/Character"
import LineSegment from "./types/LineSegment"
import Point from "./types/Point"
import { SHAPE } from "./types/SHAPE"
import WorldObject from "./types/WorldObject"

describe("Geometry", () => {
    describe("extendSegment", () => {
        test('extend in the positive x direction', () => {
            const segment = { start: { x: 1, y: 1 }, end: { x: 4, y: 1 } }
            const length = 5
            const newSegment = extendSegment(segment, length)
            expect(newSegment.start.x).toBe(1)
            expect(newSegment.start.y).toBe(1)
            expect(newSegment.end.x).toBe(9)
            expect(newSegment.end.y).toBe(1)

        })
        test('extend in the negative x direction', () => {
            const segment = { start: { x: 4, y: 1 }, end: { x: 1, y: 1 } }
            const length = 5
            const newSegment = extendSegment(segment, length)
            expect(newSegment.start.x).toBe(4)
            expect(newSegment.start.y).toBe(1)
            expect(newSegment.end.x).toBe(-4)
            expect(newSegment.end.y).toBe(1)
        })
        test('extend in the positive y direction', () => {
            const segment = { start: { x: 1, y: 2 }, end: { x: 1, y: 3 } }
            const length = 5
            const newSegment = extendSegment(segment, length)
            expect(newSegment.start.x).toBe(1)
            expect(newSegment.start.y).toBe(2)
            expect(newSegment.end.x).toBe(1)
            expect(newSegment.end.y).toBe(8)
        })
        test('extend in the negative y direction', () => {
            const segment = { start: { x: 1, y: 3 }, end: { x: 1, y: 2 } }
            const length = 5
            const newSegment = extendSegment(segment, length)
            expect(newSegment.start.x).toBe(1)
            expect(newSegment.start.y).toBe(3)
            expect(newSegment.end.x).toBe(1)
            expect(newSegment.end.y).toBe(-3)
        })
    })

    describe.skip("intersectingSegment", () => {
        function intersectingSegment(circle: WorldObject, end: Point, segments: Point[]): LineSegment {
            return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
        }
        test('2', () => {
            const circle: WorldObject = new WorldObject({ shape: SHAPE.CIRCLE, location: { x: 1, y: 1 }, radiusX: 2.5 })
            const end: Point = { x: 10, y: 2 }
            const rect: WorldObject = new WorldObject({ shape: SHAPE.RECT, location: { x: 10, y: 1 }, width: 4, height: 20 })
            const segments = rectanglePoints(rect)
            const i = intersectingSegment(circle, end, segments)
            expect(i?.start.x).toBeCloseTo(8)
            expect(i?.start.y).toBeCloseTo(-11.5)
            expect(i?.end.x).toBeCloseTo(8)
            expect(i?.end.y).toBeCloseTo(13.5)
        })
    })

    describe("polygonSlide", () => {
        test('moving to the right and slightly down', () => {
            const circle: WorldObject = new WorldObject({ shape: SHAPE.CIRCLE, location: { x: 1, y: 1 } })
            const end: Point = { x: 10, y: 2 }
            const rect: WorldObject = new WorldObject({ shape: SHAPE.RECT, location: { x: 10, y: 1 }, width: 4, height: 20 })
            const cp = polygonSlide(circle, end, rect)
            expect(cp.x).toBe(7)
            expect(cp.y).toBeCloseTo(4.685)
        })

        test('should hit the top of the rectangle and slide around it', () => {
            const circle = new Character({ location: { x: 1, y: -20 } })
            const end = { x: 1, y: 10 }
            const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 2 })

            const newPosition = polygonSlide(circle, end, rect)
            expect(newPosition?.x).toBe(-4.5)
            expect(newPosition?.y).toBe(4.5)
        })

        test('should hit the right side of the rectangle', () => {
            const circle = new Character({ location: { x: 20, y: 1 } })
            const end = { x: -10, y: 1 }
            const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 4 })

            const newPosition = polygonSlide(circle, end, rect)
            expect(newPosition?.x).toBeCloseTo(-4.5)
            expect(newPosition?.y).toBe(-4.5)
        })

        test('should hit the right side of the rectangle when not moving', () => {
            const circle = new Character({ location: { x: 20, y: 1 } })
            const end = { x: 1.9, y: 1 }
            const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 4 })

            const newPosition = polygonSlide(circle, end, rect)
            expect(newPosition?.x).toBe(4.5)
            expect(newPosition?.y).toBeCloseTo(-1.6)
        })

        test('should hit the right side of the rectangle moving at a slight angle', () => {
            //moving at a slight angle
            const circle = new Character({ location: { x: 10, y: 2 } })
            const end = { x: -10, y: 1 }
            const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 40 })

            const newPosition = polygonSlide(circle, end, rect)
            expect(newPosition?.x).toBe(4.5)
            expect(newPosition?.y).toBeCloseTo(-12.793)
        })

        test('should hit the right side of the rectangle moving at a hard angle', () => {
            //moving at a slight angle
            const circle = new Character({ location: { x: 10, y: 2 } })
            const end = { x: -10, y: 20 }
            const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 40 })

            const newPosition = polygonSlide(circle, end, rect)
            expect(newPosition?.x).toBe(-.5)
            expect(newPosition?.y).toBeCloseTo(24.230)
        })
    })

    describe.skip("perpendicularPoint", () => {
        function perpendicularPoint(pointNotOnSegment: Point, segment: LineSegment, distance: number): Point {
            return { x: 0, y: 0 }
        }
        test('below a horizontal line', () => {
            const segment = { start: { x: -10, y: 0 }, end: { x: 10, y: 0 } }
            const pointNotOnSegment = { x: 0, y: 1 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBeCloseTo(0)
            expect(newPosition?.y).toBe(2.5)
        })

        test('above a horizontal line', () => {
            const segment = { start: { x: -10, y: -1 }, end: { x: 10, y: -1 } }
            const pointNotOnSegment = { x: 0, y: -2 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBeCloseTo(0)
            expect(newPosition?.y).toBe(-3.5)
        })

        test('to the right of a vertical line', () => {
            const segment = { start: { x: 0, y: -10 }, end: { x: 0, y: 10 } }
            const pointNotOnSegment = { x: 10, y: 0 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBe(2.5)
            expect(newPosition?.y).toBeCloseTo(0)
        })
        test('to the left of a vertical line', () => {
            const segment = { start: { x: 0, y: -10 }, end: { x: 0, y: 10 } }
            const pointNotOnSegment = { x: -10, y: 0 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBe(-2.5)
            expect(newPosition?.y).toBeCloseTo(0)
        })

        test('above a line running nw to se', () => {
            const segment = { start: { x: -10, y: -10 }, end: { x: 10, y: 10 } }
            const pointNotOnSegment = { x: 5, y: -5 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBeCloseTo(1.767)
            expect(newPosition?.y).toBeCloseTo(-1.767)
        })
    })

    describe.skip("perpendicularPoint", () => {
        function perpendicularPoint(pointNotOnSegment: Point, segment: LineSegment, distance: number) {
            return { x: 0, y: 0 }
        }
        test('below a horizontal line', () => {
            const segment = { start: { x: -10, y: 0 }, end: { x: 10, y: 0 } }
            const pointOnSegment = { x: 0, y: 0 }
            const pointNotOnSegment = { x: 0, y: 1 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBe(0)
            expect(newPosition?.y).toBe(2.5)
        })

        test('above a horizontal line', () => {
            const segment = { start: { x: -10, y: -1 }, end: { x: 10, y: -1 } }
            const pointOnSegment = { x: 0, y: -1 }
            const pointNotOnSegment = { x: 0, y: -2 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBe(0)
            expect(newPosition?.y).toBe(-3.5)
        })
        test('to the right of a vertical line', () => {
            const segment = { start: { x: 0, y: -10 }, end: { x: 0, y: 10 } }
            const pointOnSegment = { x: 0, y: 0 }
            const pointNotOnSegment = { x: 10, y: 0 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBe(2.5)
            expect(newPosition?.y).toBe(0)
        })
        test('to the left of a vertical line', () => {
            const segment = { start: { x: 0, y: -10 }, end: { x: 0, y: 10 } }
            const pointOnSegment = { x: 0, y: 0 }
            const pointNotOnSegment = { x: -10, y: 0 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBe(-2.5)
            expect(newPosition?.y).toBe(0)
        })

        test('above a line running nw to se', () => {
            const segment = { start: { x: -10, y: -10 }, end: { x: 10, y: 10 } }
            const pointOnSegment = { x: 0, y: 0 }
            const pointNotOnSegment = { x: 5, y: -5 }
            const distance = 2.5
            const newPosition = perpendicularPoint(pointNotOnSegment, segment, distance)
            expect(newPosition?.x).toBeCloseTo(1.767)
            expect(newPosition?.y).toBeCloseTo(-1.767)
        })
    })

    describe.skip("closestPoint", () => {
        function closestPointPoints(point: Point, points: Point[]) {
            return { x: 1, y: 5 }
        }
        test('should find the closest point', () => {
            const points = [
                { x: 1, y: 5 },
                { x: 1, y: 6 },
                { x: 7, y: 1 },
                { x: 4, y: 4 },
            ]
            const point = { x: 0, y: 0 }

            const closestP = closestPointPoints(point, points)
            expect(closestP?.x).toBe(1)
            expect(closestP?.y).toBe(5)
        })
    })

    describe("intersectionLineLine", () => {

        test('should be undefined when they do not intersect', () => {
            const segment1: LineSegment = { start: { x: 1, y: -20 }, end: { x: 1, y: 10 } }
            const segment2: LineSegment = { start: { x: 4.5, y: -3.5 }, end: { x: -4.5, y: -3.5 } }
            const intersectionPoint = intersectionLineLine(segment1, segment2)
            expect(intersectionPoint?.x).toBe(1)
            expect(intersectionPoint?.y).toBe(-3.5)
        })

        test('should find intersection point for non-parallel line segments', () => {
            const segment1: LineSegment = { start: { x: 1, y: 3 }, end: { x: 4, y: 3 } };
            const segment2: LineSegment = { start: { x: 2, y: 1 }, end: { x: 4, y: 6 } };

            const intersectionPoint = intersectionLineLine(segment1, segment2);

            expect(intersectionPoint?.x).toEqual(2.8);
            expect(intersectionPoint?.y).toEqual(3);
        });

        test('should find intersection point for other non-parallel line segments', () => {
            const segment1: LineSegment = { start: { x: 1, y: 2 }, end: { x: 3, y: 6 } };
            const segment2: LineSegment = { start: { x: 2, y: 1 }, end: { x: 4, y: 8 } }; // Parallel segment

            const intersectionPoint = intersectionLineLine(segment1, segment2);

            expect(intersectionPoint).toEqual({ x: 4, y: 8 })
        });

        it('should find intersection point for even more non-parallel line segments', () => {
            const segment1: LineSegment = { start: { x: 1, y: 2 }, end: { x: 3, y: 6 } };
            const segment2: LineSegment = { start: { x: 2, y: 1 }, end: { x: 4, y: 3 } };

            const intersectionPoint = intersectionLineLine(segment1, segment2);

            expect(intersectionPoint).toEqual({ x: -1, y: -2 });
        });
    })

    describe("intersectionSegmentSegment", () => {

        test('should be undefined when they do not intersect', () => {
            const segment1: LineSegment = {
                start: { x: 1, y: -7 }, end: { x: 2, y: -7 }
            }
            const segment2: LineSegment = { start: { x: 7.5, y: -5 }, end: { x: -7.5, y: -5 } }

            const intersectionPoint = intersectionSegmentSegment(segment1, segment2)
            expect(intersectionPoint?.x).toBeUndefined()
            expect(intersectionPoint?.y).toBeUndefined()
        })


        test('chatgpt example', () => {
            const segment1: LineSegment = { start: { x: 1, y: 5 }, end: { x: 5, y: 1 } }
            const segment2: LineSegment = { start: { x: -1, y: 5 }, end: { x: 7, y: 1 } }

            const intersectionPoint = intersectionSegmentSegment(segment1, segment2)
            expect(intersectionPoint?.x).toBe(3)
            expect(intersectionPoint?.y).toBe(3)
        })

        test('should intersect a rectable at two points when moving down', () => {
            const circle = new Character({ location: { x: 0, y: -20 } })
            //move straight down
            const direction = { x: 0, y: 10 }
            const rect = new WorldObject({ shape: SHAPE.RECT, width: 4, height: 2 })
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(rect)

            const topIntersection = intersectionSegmentSegment({ start: circle.location, end: direction }, { start: topLeft, end: topRight })
            const leftIntersection = intersectionSegmentSegment({ start: circle.location, end: direction }, { start: bottomLeft, end: topLeft })
            const bottomIntersection = intersectionSegmentSegment({ start: circle.location, end: direction }, { start: bottomRight, end: bottomLeft })
            const rightIntersection = intersectionSegmentSegment({ start: circle.location, end: direction }, { start: topRight, end: bottomRight })

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
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(rect)

            const topIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: topLeft, end: topRight })
            const leftIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomLeft, end: topLeft })
            const bottomIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomRight, end: bottomLeft })
            const rightIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: topRight, end: bottomRight })

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
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(rect)

            expect(topRight.x).toBe(10)
            expect(topRight.y).toBe(-10)
            expect(topLeft.x).toBe(-10)
            expect(topLeft.y).toBe(-10)
            expect(bottomLeft.x).toBe(-10)
            expect(bottomLeft.y).toBe(10)
            expect(bottomRight.x).toBe(10)
            expect(bottomRight.y).toBe(10)

            const topIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: topLeft, end: topRight })
            const leftIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomLeft, end: topLeft })
            const bottomIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: bottomRight, end: bottomLeft })
            const rightIntersection = intersectionSegmentSegment({ start: circle.location, end: end }, { start: topRight, end: bottomRight })

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

    describe("rectanglePoints", () => {
        test('should handle a square at the origin', () => {
            const square = new WorldObject({ shape: SHAPE.RECT, width: 2, height: 2 })
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(square)
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
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(square)
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
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(square)
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
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(square)
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
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(square)
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
            const [topRight, topLeft, bottomLeft, bottomRight] = rectanglePoints(square)
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

    describe("distanceSegmentPolygon", () => {
        test('should beundefined if the polygon has no points', () => {
            const segment: LineSegment = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
            const polygon: Point[] = []
            expect(distanceSegmentPolygon(segment, polygon)).toBeUndefined()
        })
        test('should be 0 when its just two points', () => {
            const segment: LineSegment = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
            const polygon: Point[] = [{ x: 0, y: 0 }]
            expect(distanceSegmentPolygon(segment, polygon)).toBe(0)
        })
        test('should be 0 when its just a point on a line', () => {
            const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
            const polygon: Point[] = [{ x: 0, y: 0 }]
            expect(distanceSegmentPolygon(segment, polygon)).toBe(0)
        })
        test('should be 1 when its just a point off a line', () => {
            const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
            const polygon: Point[] = [{ x: 0, y: 1 }]
            expect(distanceSegmentPolygon(segment, polygon)).toBe(1)
        })
        test('should be 0 when its two segments crossing at the origin', () => {
            const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
            const polygon: Point[] = [{ x: 0, y: -1 }, { x: 0, y: 1 }]
            expect(distanceSegmentPolygon(segment, polygon)).toBe(0)
        })
        test('should be 1 when its two segments not crossing', () => {
            const segment: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
            const polygon: Point[] = [{ x: 0, y: 3 }, { x: 0, y: 1 }]
            expect(distanceSegmentPolygon(segment, polygon)).toBe(1)
        })

        test('should be 2 when its a box and a segment that do not intersect', () => {
            const segment: LineSegment = { start: { x: 3, y: 0 }, end: { x: 4, y: 0 } }
            const polygon: Point[] = [{ x: 1, y: -1 }, { x: -1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 }]
            expect(distanceSegmentPolygon(segment, polygon)).toBe(2)
        })

        test('should be 0 when its a box and a segment that do intersect', () => {
            const segment: LineSegment = { start: { x: 0.8, y: 0 }, end: { x: 4, y: 0 } }
            const polygon: Point[] = [{ x: 1, y: -1 }, { x: -1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 }]
            expect(distanceSegmentPolygon(segment, polygon)).toBe(0)
        })
    })

    describe("distanceSegmentSegment", () => {
        test('should be 0 when its two segments crossing at the origin', () => {
            const segment1: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
            const segment2: LineSegment = { start: { x: 0, y: -1 }, end: { x: 0, y: 1 } }
            expect(distanceSegmentSegment(segment1, segment2)).toBe(0)
        })
        test('should be 1 when its two segments not crossing', () => {
            const segment1: LineSegment = { start: { x: -1, y: 0 }, end: { x: 1, y: 0 } }
            const segment2: LineSegment = { start: { x: 0, y: 3 }, end: { x: 0, y: 1 } }
            expect(distanceSegmentSegment(segment1, segment2)).toBe(1)
        })

        test('should be 3 when its horizontal segments', () => {
            const segment1: LineSegment = { start: { x: 1, y: 0 }, end: { x: 10, y: 0 } }
            const segment2: LineSegment = { start: { x: 2, y: 3 }, end: { x: 8, y: 3 } }
            expect(distanceSegmentSegment(segment1, segment2)).toBe(3)
        })

        test('should be 4 when its horizontal segments that are sequential', () => {
            const segment1: LineSegment = { start: { x: 1, y: 0 }, end: { x: 10, y: 0 } }
            const segment2: LineSegment = { start: { x: 10, y: 4 }, end: { x: 18, y: 4 } }
            expect(distanceSegmentSegment(segment1, segment2)).toBe(4)
        })

        test('should be 5 when its two segments that make an open v', () => {
            const segment1: LineSegment = { start: { x: 1, y: 0 }, end: { x: 10, y: 10 } }
            const segment2: LineSegment = { start: { x: 15, y: 10 }, end: { x: 18, y: 4 } }
            expect(distanceSegmentSegment(segment1, segment2)).toBe(5)
        })
        test('should be 6 when they are parallel and overlap', () => {
            const segment1: LineSegment = { start: { x: 1, y: 1 }, end: { x: 10, y: 1 } }
            const segment2: LineSegment = { start: { x: 8, y: 7 }, end: { x: 18, y: 7 } }
            expect(distanceSegmentSegment(segment1, segment2)).toBe(6)
        })
    })

    describe("distancePointSegment", () => {
        test('should be 0 when the point is on the middle of the segment', () => {
            const point: Point = { x: 0, y: 0 }
            const segment: LineSegment = { start: { x: 0, y: -1 }, end: { x: 0, y: 1 } }
            expect(distancePointSegment(point, segment)).toBe(0)
        })
        test('should be 0 when the point is on the end of the segment', () => {
            const point: Point = { x: 0, y: 3 }
            const segment: LineSegment = { start: { x: 0, y: 3 }, end: { x: 0, y: 1 } }
            expect(distancePointSegment(point, segment)).toBe(0)
        })
        test('should be 7 when the point is above the segment', () => {
            const point: Point = { x: -1, y: -6 }
            const segment: LineSegment = { start: { x: -10, y: 1 }, end: { x: 10, y: 1 } }
            expect(distancePointSegment(point, segment)).toBe(7)
        })

    })

    describe.skip("closestPointsBetweenSegments", () => {
        function closestPointsBetweenSegments(segment1: LineSegment, segment2: LineSegment) {
            return [{ x: 0, y: 0 }, { x: 0, y: 0 }]
        }
        test.skip('should be the first point when they are the same segment', () => {
            const segment1: LineSegment = { start: { x: 1, y: 4 }, end: { x: 3, y: 5 } }
            const segment2: LineSegment = { start: { x: 1, y: 4 }, end: { x: 3, y: 5 } }
            const [p1, p2] = closestPointsBetweenSegments(segment1, segment2)
            expect(p1?.x).toBe(1)
            expect(p1?.y).toBe(4)
            expect(p2?.x).toBe(1)
            expect(p2?.y).toBe(4)
        })
        test('should be 1,2 points intersect', () => {
            const segment1: LineSegment = { start: { x: 1, y: -1 }, end: { x: 1, y: 3 } }
            const segment2: LineSegment = { start: { x: 2, y: 2 }, end: { x: -1, y: 2 } }
            const [p1, p2] = closestPointsBetweenSegments(segment1, segment2)
            expect(p1?.x).toBe(1)
            expect(p1?.y).toBe(2)
            expect(p2?.x).toBe(1)
            expect(p2?.y).toBe(2)
        })
        test('should be', () => {
            const segment1: LineSegment = { start: { x: 1, y: -10 }, end: { x: 1, y: -1 } }
            const segment2: LineSegment = { start: { x: 1, y: 0 }, end: { x: -1, y: 0 } }
            const [p1, p2] = closestPointsBetweenSegments(segment1, segment2)
            expect(p1?.x).toBe(1)
            expect(p1?.y).toBe(-1)
            expect(p2?.x).toBe(1)
            expect(p2?.y).toBe(0)
        })

        test('should be', () => {
            const segment1: LineSegment = { start: { x: 1, y: 0 }, end: { x: -1, y: 0 } }
            const segment2: LineSegment = { start: { x: 1, y: -10 }, end: { x: 1, y: -1 } }
            const [p1, p2] = closestPointsBetweenSegments(segment1, segment2)
            expect(p1?.x).toBe(1)
            expect(p1?.y).toBe(0)
            expect(p2?.x).toBe(1)
            expect(p2?.y).toBe(-1)
        })


        test.skip('when the two lines are vertical parallel', () => {
            const segment1: LineSegment = { start: { x: 1, y: -20 }, end: { x: 1, y: 10 } }
            const segment2: LineSegment = { start: { x: 2, y: -1 }, end: { x: 2, y: 1 } }
            const [p1, p2] = closestPointsBetweenSegments(segment1, segment2)
            expect(p1?.x).toBe(1)
            expect(p1?.y).toBe(-1)
            expect(p2?.x).toBe(2)
            expect(p2?.y).toBe(-1)
        })

        test.skip('when the two lines are horizontal parallel', () => {
            const segment1: LineSegment = { start: { x: 1, y: 1 }, end: { x: 5, y: 1 } }
            const segment2: LineSegment = { start: { x: 2, y: 2 }, end: { x: 4, y: 2 } }
            const [p1, p2] = closestPointsBetweenSegments(segment1, segment2)
            expect(p1?.x).toBe(2)
            expect(p1?.y).toBe(1)
            expect(p2?.x).toBe(2)
            expect(p2?.y).toBe(2)
        })

        test('should be', () => {
            const segment1: LineSegment = { start: { x: 1, y: -20 }, end: { x: 1, y: 10 } }
            const segment2: LineSegment = { start: { x: -2, y: -1 }, end: { x: 2, y: -1 } }
            const [p1, p2] = closestPointsBetweenSegments(segment1, segment2)
            expect(p1?.x).toBe(1)
            expect(p1?.y).toBe(-1)
            expect(p2?.x).toBe(1)
            expect(p2?.y).toBe(-1)
        })
    })

    describe.skip("closestPointOnSegment", () => {
        function closestPointOnSegment(lineSegment: LineSegment, point: Point): Point {
            return { x: 10, y: 2 }
        }
        test('should find a point on the segment', () => {
            const lineSegment: LineSegment = { start: { x: 10, y: 2 }, end: { x: -10, y: 2 } }
            const point: Point = { x: 4, y: 2 }
            const cp = closestPointOnSegment(lineSegment, point)
            expect(cp.x).toBe(4)
            expect(cp.y).toBe(2)

        })
        test('should find a point at the end of the segment', () => {
            const lineSegment: LineSegment = { start: { x: 10, y: 2 }, end: { x: -10, y: 2 } }
            const point: Point = { x: 11, y: 3 }
            const cp = closestPointOnSegment(lineSegment, point)
            expect(cp.x).toBe(10)
            expect(cp.y).toBe(2)

        })
    })
})