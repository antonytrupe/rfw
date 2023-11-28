import LineSegment from "./types/LineSegment"
import Point from "./types/Point"
import Ray from "./types/Ray"
import { SHAPE } from "./types/SHAPE"
import WorldObject from "./types/WorldObject"

export const E = 0 / 4 * Math.PI
export const NE = 1 / 4 * Math.PI
export const N = 2 / 4 * Math.PI
export const NW = 3 / 4 * Math.PI
export const W = 4 / 4 * Math.PI
export const SW = 5 / 4 * Math.PI
export const S = 6 / 4 * Math.PI
export const SE = 7 / 4 * Math.PI
export const LEFT = 1
export const RIGHT = -1

export function calculateIntersectionRayPolygon(ray: Ray, polygon: Point[]): Point | null {
    let intersectionPoint = null

    for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i]
        const end = polygon[(i + 1) % polygon.length]

        const intersection = rayIntersectsSegment(ray, { start, end })

        if (intersection) {
            if (!intersectionPoint || intersection.x < intersectionPoint.x) {
                intersectionPoint = intersection
            }
        }
    }
    return intersectionPoint
}

export function rayIntersectsSegment(ray: Ray, segment: LineSegment): Point | null {
    const [x1, y1] = [segment.start.x, segment.start.y]
    const [x2, y2] = [segment.end.x, segment.end.y]
    const [x3, y3] = [ray.origin.x, ray.origin.y]
    const [x4, y4] = [ray.origin.x + ray.direction.x, ray.origin.y + ray.direction.y]

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    if (denominator === 0) {
        return null //The ray and segment are parallel
    }

    const t =
        ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
    const u =
        -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

    if (t > 0 && t < 1 && u > 0) {
        const intersectionX = x1 + t * (x2 - x1)
        const intersectionY = y1 + t * (y2 - y1)
        return { x: intersectionX, y: intersectionY }
    }

    return null //No intersection
}

export function calculateRectanglePoints(rectangle: WorldObject): Point[] {
    const { location, width, height, rotation } = rectangle

    const halfWidth = width / 2
    const halfHeight = height / 2

    const cosA = Math.cos(rotation)
    const sinA = Math.sin(rotation)

    const topRight: Point = {
        x: location.x + halfWidth * cosA - halfHeight * sinA,
        y: location.y - halfWidth * sinA - halfHeight * cosA
    }

    const topLeft: Point = {
        x: location.x - halfWidth * cosA - halfHeight * sinA,
        y: location.y + halfWidth * sinA - halfHeight * cosA
    }

    const bottomLeft: Point = {
        x: location.x - halfWidth * cosA + halfHeight * sinA,
        y: location.y + halfWidth * sinA + halfHeight * cosA
    }

    const bottomRight: Point = {
        x: location.x + halfWidth * cosA + halfHeight * sinA,
        y: location.y - halfWidth * sinA + halfHeight * cosA
    }

    return [topRight, topLeft, bottomLeft, bottomRight]
}

export function calculateDistanceSegmentPolygon(segment: LineSegment, polygon: Point[]): number | undefined {
    let closestDistance: number | undefined = undefined
    if (polygon.length == 0) {
        return undefined
    }
    if (polygon.length == 1) {
        return getDistancePointSegment(polygon[0], segment)
    }
    if (polygon.length == 2) {
        return getDistanceSegmentSegment({ start: polygon[0], end: polygon[1] }, segment)
    }
    for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i]
        const end = polygon[(i + 1) % polygon.length]

        const d = getDistanceSegmentSegment(segment, { start, end })
        if (d == 0) {
            return 0
        }
        if (closestDistance == undefined || d < closestDistance) {
            closestDistance = d
        }
    }
    return closestDistance
}

export function getDistanceSegmentSegment(segment1: LineSegment, segment2: LineSegment): number {
    const i = calculateIntersectionSegmentSegment(segment1, segment2)
    if (!!i) {
        return 0
    }

    // Calculate the distance between all combinations of points on the two segments
    const distances = [
        getDistancePointSegment(segment1.start, segment2),
        getDistancePointSegment(segment1.end, segment2),
        getDistancePointSegment(segment2.start, segment1),
        getDistancePointSegment(segment2.end, segment1),
    ];

    // Return the minimum distance
    return Math.min(...distances);
}

export function calculateIntersectionSegmentPolygon(segment: LineSegment, polygon: Point[]): Point[] {
    let intersectionPoints = []

    for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i]
        const end = polygon[(i + 1) % polygon.length]

        const intersection = calculateIntersectionSegmentSegment(segment, { start, end })

        if (intersection) {
            intersectionPoints.push(intersection)
        }
    }
    return intersectionPoints
}

export function getDistancePointSegment(point: Point, segment: LineSegment): number {
    const { start, end } = segment;
    const segmentLength = getDistancePointPoint(start, end);

    if (segmentLength === 0) {
        // Treat the segment as a point
        return getDistancePointPoint(point, start);
    }

    // Calculate the projection of the point onto the line defined by the segment
    const t = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / (segmentLength * segmentLength);

    if (t < 0) {
        // Closest point is the start of the segment
        return getDistancePointPoint(point, start);
    } else if (t > 1) {
        // Closest point is the end of the segment
        return getDistancePointPoint(point, end);
    } else {
        // Closest point is on the segment
        const projectionX = start.x + t * (end.x - start.x);
        const projectionY = start.y + t * (end.y - start.y);
        return getDistancePointPoint(point, { x: projectionX, y: projectionY });
    }
}

export function calculateIntersectionRaySegment(ray: Ray, segment: LineSegment): Point | null {
    const { origin, direction } = ray
    const { start, end } = segment

    const rayDir = direction
    const segmentDir = { x: end.x - start.x, y: end.y - start.y }
    const rayStartToSegmentStart = { x: start.x - origin.x, y: start.y - origin.y }

    // Calculate the determinant
    const determinant = rayDir.x * segmentDir.y - rayDir.y * segmentDir.x

    if (determinant === 0) {
        // The ray and segment are parallel
        return null
    }

    // Calculate the parameters 't' and 'u'
    const t = (rayStartToSegmentStart.x * segmentDir.y - rayStartToSegmentStart.y * segmentDir.x) / determinant
    const u = (rayStartToSegmentStart.x * rayDir.y - rayStartToSegmentStart.y * rayDir.x) / determinant


    if (t >= 0 && u >= 0 && u <= 1) {
        // Intersection point is within the segment

        // Calculate the intersection point
        const intersectionX = origin.x + t * rayDir.x
        const intersectionY = origin.y + t * rayDir.y

        // Ensure the intersection point is along the ray (not behind the origin)
        if (t >= 0) {
            return { x: intersectionX, y: intersectionY }
        }
    }

    // No intersection
    return null
}

export function calculatePerpendicularPointOnSameSide(
    segment: LineSegment,
    pointOnSegment: Point,
    pointNotOnSegment: Point,
    distance: number
): Point | undefined {
    const { start, end } = segment

    // Calculate the vector along the segment
    const segmentVector = { x: end.x - start.x, y: end.y - start.y }

    // Calculate the vector from the point on the segment to the point not on the segment
    const pointVector = { x: pointNotOnSegment.x - pointOnSegment.x, y: pointNotOnSegment.y - pointOnSegment.y }
    //console.log('pointVector', pointVector)

    // Calculate the dot product of the two vectors
    const dotProduct = segmentVector.x * pointVector.x + segmentVector.y * pointVector.y
    //console.log('dotProduct', dotProduct)

    // Calculate the projection of pointVector onto segmentVector
    const projection = {
        x: (dotProduct / (segmentVector.x * segmentVector.x + segmentVector.y * segmentVector.y)) * segmentVector.x,
        y: (dotProduct / (segmentVector.x * segmentVector.x + segmentVector.y * segmentVector.y)) * segmentVector.y,
    }
    //console.log('projection', projection)

    // Calculate the perpendicular vector
    const perpendicularVector = { x: pointVector.x - projection.x, y: pointVector.y - projection.y }
    //console.log('perpendicularVector', perpendicularVector)

    // Calculate the length of the perpendicular vector
    const perpendicularVectorLength = Math.sqrt(
        perpendicularVector.x * perpendicularVector.x + perpendicularVector.y * perpendicularVector.y
    )
    //console.log('perpendicularVectorLength', perpendicularVectorLength)

    // Calculate the unit vector in the direction of the perpendicular vector
    const unitPerpendicularVector = {
        x: perpendicularVector.x / perpendicularVectorLength,
        y: perpendicularVector.y / perpendicularVectorLength,
    }
    //console.log('unitPerpendicularVector', unitPerpendicularVector)

    // Calculate the new point at the specified distance along the perpendicular vector
    const newPoint = {
        x: pointOnSegment.x + unitPerpendicularVector.x * distance,
        y: pointOnSegment.y + unitPerpendicularVector.y * distance,
    }

    return newPoint
}

function extendSegment(segment: LineSegment, extensionLength: number): LineSegment {
    const { start, end } = segment;
  
    // Calculate the vector along the original segment
    const segmentVector = { x: end.x - start.x, y: end.y - start.y };
  
    // Calculate the unit vector in the direction of the original segment
    const unitSegmentVector = {
      x: segmentVector.x / Math.sqrt(segmentVector.x * segmentVector.x + segmentVector.y * segmentVector.y),
      y: segmentVector.y / Math.sqrt(segmentVector.x * segmentVector.x + segmentVector.y * segmentVector.y),
    };
  
    // Calculate the new endpoint
    const newEnd = {
      x: end.x + unitSegmentVector.x * extensionLength,
      y: end.y + unitSegmentVector.y * extensionLength,
    };
  
    // Return the extended segment
    return { start, end: newEnd };
  }
  

export function calculateCollisionPoint(circle: WorldObject, end: Point, shape: WorldObject): Point | undefined {
    console.log('end',end)

    //TODO extend the circle.position-end segment by the radius of the circle first
    const {end:newEnd}=extendSegment({ start: circle.location, end: end },circle.radiusX*2)
    console.log('circle.location',circle.location)
    console.log('newEnd',newEnd)


    //get all the vertices
    let vertices: Point[] = []
    if (shape.shape == SHAPE.RECT) {
        vertices = calculateRectanglePoints(shape)
        //console.log('vertices', vertices)
    }

    //get all the collisions of all the segments
    let closestCollision: Point | undefined = undefined
    let closestSegment: LineSegment | undefined = undefined
    let closestDistance: number
    console.log('vertices',vertices)
    vertices.forEach((a, i) => {
        //TODO need to extend the segments so the edges of the circle will clip the corners
        const b = vertices[i == 0 ? vertices.length - 1 : i - 1]
        const c = calculateIntersectionSegmentSegment({ start: circle.location, end: newEnd }, { start: a, end: b })
        console.log('c', c)
        if (!!c) {

            if (!closestCollision) {
                console.log('first side')
                closestCollision = c
                closestDistance = getDistancePointPoint(circle.location, c)
                closestSegment = { start: a, end: b }
            }
            else {
                console.log('not first side')
                const d = getDistancePointPoint(circle.location, c)
                if (d < closestDistance) {
                    closestDistance = d
                    closestCollision = c
                    closestSegment = { start: a, end: b }
                }
            }
        }
    })

    //now get the collision point closest to the original location
    console.log('closestCollision', closestCollision)
    console.log('closestSegment', closestSegment)

    //now back off from where we collided
    if (!!closestCollision && !!closestSegment) {
        //console.log('back out of the rect now')
        const p = calculatePerpendicularPointOnSameSide(closestSegment, closestCollision, circle.location, circle.radiusX)
        // console.log('p', p)
        return p
    }
    return undefined
}

export function findClosestPoint(referencePoint: Point, points: Point[]): Point | undefined {
    if (points.length === 0) {
        return undefined
    }

    let closestPoint = points[0]
    let closestDistance = getDistancePointPoint(referencePoint, closestPoint)

    for (let i = 1; i < points.length; i++) {
        const currentPoint = points[i]
        const currentDistance = getDistancePointPoint(referencePoint, currentPoint)

        if (currentDistance < closestDistance) {
            closestPoint = currentPoint
            closestDistance = currentDistance
        }
    }
    return closestPoint
}

export function getDistancePointPoint(p1: Point, p2: Point) {
    const deltaX = p2.x - p1.x
    const deltaY = p2.y - p1.y
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    return distance
}

export function calculateIntersectionSegmentSegment(segment1: LineSegment, segment2: LineSegment): Point | undefined {
    const { start: p1, end: q1 } = segment1
    const { start: p2, end: q2 } = segment2

    const orientation = (p: Point, q: Point, r: Point): number => {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
        if (val === 0) return 0 // Collinear
        return val > 0 ? 1 : 2 // Clockwise or counterclockwise
    }

    const onSegment = (p: Point, q: Point, r: Point): boolean => {
        return (
            q.x <= Math.max(p.x, r.x) &&
            q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) &&
            q.y >= Math.min(p.y, r.y)
        )
    }

    const orientation1 = orientation(p1, q1, p2)
    const orientation2 = orientation(p1, q1, q2)
    const orientation3 = orientation(p2, q2, p1)
    const orientation4 = orientation(p2, q2, q1)

    // General case
    if (orientation1 !== orientation2 && orientation3 !== orientation4) {
        const intersectionX =
            ((p1.x * q1.y - p1.y * q1.x) * (p2.x - q2.x) - (p1.x - q1.x) * (p2.x * q2.y - p2.y * q2.x)) /
            ((p1.x - q1.x) * (p2.y - q2.y) - (p1.y - q1.y) * (p2.x - q2.x))

        const intersectionY =
            ((p1.x * q1.y - p1.y * q1.x) * (p2.y - q2.y) - (p1.y - q1.y) * (p2.x * q2.y - p2.y * q2.x)) /
            ((p1.x - q1.x) * (p2.y - q2.y) - (p1.y - q1.y) * (p2.x - q2.x))

        const intersectionPoint: Point = { x: intersectionX, y: intersectionY }

        // Check if the intersection point lies on both line segments
        if (onSegment(p1, intersectionPoint, q1) && onSegment(p2, intersectionPoint, q2)) {
            return intersectionPoint
        }
    }

    // No intersection
    return undefined
}

export function isPointOnLineSegment(point: Point, segment: LineSegment): boolean {
    const { start, end } = segment

    // Check if the point is within the bounding box of the line segment
    if (
        (point.x >= Math.min(start.x, end.x) && point.x <= Math.max(start.x, end.x)) &&
        (point.y >= Math.min(start.y, end.y) && point.y <= Math.max(start.y, end.y))
    ) {
        // Calculate the cross product of the vectors formed by the point and the endpoints
        const crossProduct =
            (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y)

        // Allow for a small epsilon to handle floating-point imprecisions
        const epsilon = 1e-10

        // Check if the point is close enough to be considered on the line
        return Math.abs(crossProduct) < epsilon
    }

    return false
}

export function getRotation(src: Point, dest: Point) {
    return (Math.atan2(-dest.y - -src.y, dest.x - src.x) + (4 / 2 * Math.PI)) % (Math.PI * 2)
}

export function getRotationDelta(current: number, target: number) {
    let delta = (target - current + (Math.PI * 8 / 4)) % (Math.PI * 2)
    if (delta > Math.PI) {
        delta = -(Math.PI * 2 - delta)
    }
    return delta
}
