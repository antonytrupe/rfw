import Line from "./types/Line"
import LineSegment from "./types/LineSegment"
import Point, { Points } from "./types/Point"
import Ray from "./types/Ray"
import { SHAPE } from "./types/SHAPE"
import WorldObject from "./types/WorldObject"
import { clamp } from "./utility"

export function calculateRotationAcceleration(current: number, target: number) {
    let delta = getRotationDelta(current, target)
    //do something about creeping up on 0
    let a = clamp(delta / (Math.PI / 4), -1, 1)
    if (Math.abs(a) > .01 || a == 0)
        return a
    else
        return Math.abs(a) / a * .01
}

function calculatePerpendicularPoint(rectangle: WorldObject, pointOnEdge: Point, distance: number): Point | null {
    const { location, width, height, rotation } = rectangle

    //Translate the point on the edge to the local coordinate system of the rotated rectangle
    const translatedPoint = {
        x: (pointOnEdge.x - location.x) * Math.cos(-rotation) - (pointOnEdge.y - location.y) * Math.sin(-rotation),
        y: (pointOnEdge.x - location.x) * Math.sin(-rotation) + (pointOnEdge.y - location.y) * Math.cos(-rotation),
    }

    //Check if the translated point is on the left or right edge of the rectangle
    const onLeftEdge = translatedPoint.x < -width / 2
    const onRightEdge = translatedPoint.x > width / 2

    //Check if the translated point is on the top or bottom edge of the rectangle
    const onTopEdge = translatedPoint.y < -height / 2
    const onBottomEdge = translatedPoint.y > height / 2

    //Calculate the direction vector along the edge
    let direction: Point

    if (onLeftEdge) {
        direction = { x: -1, y: 0 }
    } else if (onRightEdge) {
        direction = { x: 1, y: 0 }
    } else if (onTopEdge) {
        direction = { x: 0, y: -1 }
    } else if (onBottomEdge) {
        direction = { x: 0, y: 1 }
    } else {
        console.log('The point is not on any edge')
        return null //The point is not on any edge
    }

    //Normalize the direction vector
    const normalizedDirection = {
        x: direction.x / Math.sqrt(direction.x ** 2 + direction.y ** 2),
        y: direction.y / Math.sqrt(direction.x ** 2 + direction.y ** 2),
    }

    //Calculate the perpendicular point at the specified distance
    const perpendicularPoint = {
        x: location.x + translatedPoint.x + normalizedDirection.y * distance,
        y: location.y + translatedPoint.y - normalizedDirection.x * distance,
    }

    //Transform the perpendicular point back to the global coordinate system
    const globalPerpendicularPoint = {
        x: perpendicularPoint.x * Math.cos(rotation) - perpendicularPoint.y * Math.sin(rotation) + location.x,
        y: perpendicularPoint.x * Math.sin(rotation) + perpendicularPoint.y * Math.cos(rotation) + location.y,
    }

    return globalPerpendicularPoint
}
export function getNextPointOnLine(startPoint: Point, endPoint: Point, distance: number): Point {
    // Calculate the direction vector of the line
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;

    // Calculate the length of the line segment
    const length = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    const nx = dx / length;
    const ny = dy / length;

    // Calculate the new coordinates
    const xNew = startPoint.x + nx * distance;
    const yNew = startPoint.y + ny * distance;

    // Return the new coordinates as a Point object
    return { x: xNew, y: yNew };
}

function nextSegment(point: Point, vertices: Points): LineSegment {
    const i = vertices.findIndex((p) => { return p.x == point.x && p.y == point.y })
    return { start: vertices[i], end: vertices[i == vertices.length - 1 ? 0 : i + 1] }
}

function perpendicularRay(segment: LineSegment, pointOnSegment: Point, externalPoint: Point): Ray {
    //console.log('pointOnSegment', pointOnSegment)

    // Find the closest point on the segment to the given point that is not on the segment
    const closestPoint = closestPointOnLine(segmentToLine(segment), externalPoint)
    //console.log('closestPoint', closestPoint)

    // Calculate the direction vector from the closest point on the segment to the given point
    const directionVector = normalizeVector({ x: externalPoint.x - closestPoint.x, y: externalPoint.y - closestPoint.y })
    //console.log('directionVector', directionVector)

    // Define the equation of the perpendicular ray using the closest point and perpendicular vector
    const perpendicularRay: Ray = {
        origin: pointOnSegment,
        direction: directionVector,
    }

    return perpendicularRay
}

function closestPointOnLine(line: Line, externalPoint: Point): Point {
    const { a, b } = line

    // Calculate the direction vector of the line
    const lineVector = { x: b.x - a.x, y: b.y - a.y }

    // Calculate the vector from point1 to the external point
    const vectorToPoint = { x: externalPoint.x - a.x, y: externalPoint.y - a.y }

    // Calculate the scalar projection of vectorToPoint onto the lineVector
    const scalarProjection = (vectorToPoint.x * lineVector.x + vectorToPoint.y * lineVector.y) /
        (lineVector.x * lineVector.x + lineVector.y * lineVector.y)

    // Calculate the closest point on the line
    const closestPoint: Point = {
        x: a.x + scalarProjection * lineVector.x,
        y: a.y + scalarProjection * lineVector.y,
    }

    return closestPoint
}

export function isPointBetweenRays(point: Point, ray1: Ray, ray2: Ray): boolean {
    // Calculate vectors representing the two rays
    const vector1 = ray1.direction;
    const vector2 = ray2.direction;

    // Calculate vectors from the origin of each ray to the test point
    const vectorToPoint1 = { x: point.x - ray1.origin.x, y: point.y - ray1.origin.y };
    const vectorToPoint2 = { x: point.x - ray2.origin.x, y: point.y - ray2.origin.y };

    // Calculate the cross products of the vectors
    const crossProduct1 = vector1.x * vectorToPoint1.y - vector1.y * vectorToPoint1.x;
    const crossProduct2 = vector2.x * vectorToPoint2.y - vector2.y * vectorToPoint2.x;

    // Check if the orientations are different (one positive, one negative)
    return (crossProduct1 < 0 && crossProduct2 > 0) || (crossProduct1 > 0 && crossProduct2 < 0);
}

export function polygonSlide(circle: WorldObject, end: Point, shape: WorldObject): Point {
    console.log('--->POLYGONSLIDE')
    //console.log('circle.location', circle.location)
    //console.log('end', end)
    //console.log('shape', { shape: 'SHAPE.' + shape.shape, location: shape.location, width: shape.width, height: shape.height })
    const circleSegment = { start: circle.location, end }
    const circleVector = normalizedVectorFromLineSegment(circleSegment)
    //const circleRay = convertToRay(circleSegment)
    //console.log('circleVector', circleVector)
    let remainingDistance = distanceBetweenPoints(circle.location, end)

    //get all the vertices
    let vertices: Point[] = []
    if (shape.shape == SHAPE.RECT) {
        vertices = rectanglePoints(shape)
    }
    //console.log('vertices', vertices)
    let collidingSegment = intersectingSegment(circle, end, vertices)
    //console.log('collidingSegment', collidingSegment)

    if (!collidingSegment) {
        console.log('how did we not hit anything')
        console.log('circle', JSON.stringify({ location: circle.location, rotation: circle.rotation }))
        console.log('end', end)
        console.log('vertices', JSON.stringify(vertices))

        return end
    }
    const segmentVector1 = normalizedVectorFromLineSegment(collidingSegment)
    //console.log('segmentVector1', segmentVector1)

    const segmentVector2 = normalizedVectorFromLineSegment({ start: collidingSegment.end, end: collidingSegment.start })
    //console.log('segmentVector2', segmentVector2)

    const segmentVector = closestVectorToTarget(circleVector, [segmentVector1, segmentVector2])
    //console.log('segmentVector', segmentVector)

    //const intersection = intersectionSegmentSegment(circleSegment, collidingSegment)
    //const intersection = intersectionRaySegment(convertToRay(circleSegment), collidingSegment)
    //console.log('collidingSegment', collidingSegment)

    //console.log('circle.location', circle.location)

    //TODO see if we're past the edge of the colliding segment
    const startPerp = perpendicularRay(collidingSegment, collidingSegment.start, circle.location)
    //console.log('startPerp', startPerp)

    const endPerp = perpendicularRay(collidingSegment, collidingSegment.end, circle.location)
    //console.log('endPerp', endPerp)

    //end, I think, but maybe character.location
    const isBetweenSegment = isPointBetweenRays(circle.location, startPerp, endPerp)
    //console.log('isBetweenSegment', isBetweenSegment)
    if (!isBetweenSegment) {
        console.log('slide around corner time')
        //TODO move in a circle around the end point
        //find the vector of the end perp(maybe start perp?)
        //console.log('endPerp', endPerp)
        const endVector = normalizeVector(endPerp.direction)
        //console.log('endVector', endVector)
        //find the next segment
        const seg2 = nextSegment(collidingSegment.end, vertices)
        //find the vector of the next segment's perp endpoint thingy
        //find the distance between those two vectors
    }

    //console.log('intersection', intersection)
    //if (!intersection) {
    //console.log('wat2')
    //return end
    //}

    //find the parellel line to the intersectingsegment to move along
    const parallelSegment = getParallelLine(collidingSegment, -circle.radiusX)
    //console.log('parallelSegment', parallelSegment)

    //find the intersection on the parallelsegment and circlesegment
    //let newPoint = intersectionSegmentSegment(parallelSegment, circleSegment)
    let newPoint = intersectionLineLine(circleSegment, parallelSegment)
    //console.log('newPoint', newPoint)
    if (!newPoint) {
        console.log('wat1')
        return end
    }

    //get the distance from the newpoint and the starting point
    remainingDistance = Math.max(0, remainingDistance - distanceBetweenPoints(circle.location, newPoint))
    //console.log('remainingDistance', remainingDistance)

    //get how far we have to slide
    const collidingSegmentDistanceRemaining = distanceBetweenPoints(circle.location, parallelSegment.end)
    //console.log('collidingSegmentDistanceRemaining', collidingSegmentDistanceRemaining)

    //now move parallel to the segment up to the min of remainingDistance and the remaining distance in the collidingSegment
    const d = Math.min(remainingDistance, collidingSegmentDistanceRemaining)
    newPoint = calculateNewPoint(newPoint, multiplyVectorByScalar(segmentVector, d))
    //console.log('newPoint', newPoint)

    //subtract how far we slide along the side
    remainingDistance -= d
    //console.log('remainingDistance', remainingDistance)

    //now continue in the circle's original vector however
    newPoint = calculateNewPoint(newPoint, multiplyVectorByScalar(circleVector, remainingDistance))
    console.log('newPoint', newPoint)
    console.log('<----POLYGONSLIDE')
    return newPoint
}

export function intersectionRayPolygon(ray: Ray, polygon: Point[]): Point | null {
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

function normalizedVectorFromLineSegment(lineSegment: LineSegment): Point {
    const segmentVector = { x: lineSegment.end.x - lineSegment.start.x, y: lineSegment.end.y - lineSegment.start.y }
    return normalizeVector(segmentVector)
}

function rayIntersectsSegment(ray: Ray, segment: LineSegment): Point | null {
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

export function rectanglePoints(rectangle: WorldObject): Point[] {
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

    return [topRight, bottomRight, bottomLeft, topLeft]
}

export function distanceSegmentPolygon(segment: LineSegment, polygon: Point[]): number | undefined {
    let closestDistance: number | undefined = undefined
    if (polygon.length == 0) {
        return undefined
    }
    if (polygon.length == 1) {
        return distancePointSegment(polygon[0], segment)
    }
    if (polygon.length == 2) {
        return distanceSegmentSegment({ start: polygon[0], end: polygon[1] }, segment)
    }
    for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i]
        const end = polygon[(i + 1) % polygon.length]

        const d = distanceSegmentSegment(segment, { start, end })
        if (d == 0) {
            return 0
        }
        if (closestDistance == undefined || d < closestDistance) {
            closestDistance = d
        }
    }
    return closestDistance
}

export function distanceSegmentSegment(segment1: LineSegment, segment2: LineSegment): number {
    const i = intersectionSegmentSegment(segment1, segment2)
    if (!!i) {
        return 0
    }

    //Calculate the distance between all combinations of points on the two segments
    const distances = [
        distancePointSegment(segment1.start, segment2),
        distancePointSegment(segment1.end, segment2),
        distancePointSegment(segment2.start, segment1),
        distancePointSegment(segment2.end, segment1),
    ]

    //Return the minimum distance
    return Math.min(...distances)
}

export function intersectionSegmentPolygon(segment: LineSegment, polygon: Point[]): Point[] {
    let intersectionPoints = []

    for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i]
        const end = polygon[(i + 1) % polygon.length]

        const intersection = intersectionSegmentSegment(segment, { start, end })

        if (intersection) {
            intersectionPoints.push(intersection)
        }
    }
    return intersectionPoints
}

export function distancePointSegment(point: Point, segment: LineSegment): number {
    const { start, end } = segment
    const segmentLength = distanceBetweenPoints(start, end)

    if (segmentLength === 0) {
        //Treat the segment as a point
        return distanceBetweenPoints(point, start)
    }

    //Calculate the projection of the point onto the line defined by the segment
    const t = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / (segmentLength * segmentLength)

    if (t < 0) {
        //Closest point is the start of the segment
        return distanceBetweenPoints(point, start)
    } else if (t > 1) {
        //Closest point is the end of the segment
        return distanceBetweenPoints(point, end)
    } else {
        //Closest point is on the segment
        const projectionX = start.x + t * (end.x - start.x)
        const projectionY = start.y + t * (end.y - start.y)
        return distanceBetweenPoints(point, { x: projectionX, y: projectionY })
    }
}

export function normalizeVector(vector: { x: number, y: number }): Point {
    const length = Math.sqrt(vector.x ** 2 + vector.y ** 2)

    if (length === 0) {
        return { x: 0, y: 0 } //Avoid division by zero
    }

    return { x: vector.x / length, y: vector.y / length }
}

function normalizedVectorRay(ray: Ray) {
    return normalizeVector(ray.direction)
}

function pointOnRay(ray: Ray, distance: number): Point {
    const normalizedDirection = normalizeVector(ray.direction)

    const point = {
        x: ray.origin.x + distance * normalizedDirection.x,
        y: ray.origin.y + distance * normalizedDirection.y,
    }

    return point
}

function intersectionRaySegment(ray: Ray, segment: LineSegment): Point | undefined {
    const { origin, direction } = ray
    const { start, end } = segment

    const rayDir = direction
    const segmentDir = { x: end.x - start.x, y: end.y - start.y }
    const rayStartToSegmentStart = { x: start.x - origin.x, y: start.y - origin.y }

    //Calculate the determinant
    const determinant = rayDir.x * segmentDir.y - rayDir.y * segmentDir.x

    if (determinant === 0) {
        //The ray and segment are parallel
        return undefined
    }

    //Calculate the parameters 't' and 'u'
    const t = (rayStartToSegmentStart.x * segmentDir.y - rayStartToSegmentStart.y * segmentDir.x) / determinant
    const u = (rayStartToSegmentStart.x * rayDir.y - rayStartToSegmentStart.y * rayDir.x) / determinant


    if (t >= 0 && u >= 0 && u <= 1) {
        //Intersection point is within the segment

        //Calculate the intersection point
        const intersectionX = origin.x + t * rayDir.x
        const intersectionY = origin.y + t * rayDir.y

        //Ensure the intersection point is along the ray (not behind the origin)
        if (t >= 0) {
            return { x: intersectionX, y: intersectionY }
        }
    }

    //No intersection
    return undefined
}

export function extendSegment(segment: LineSegment, extensionLength: number): LineSegment {
    const { start, end } = segment

    //Calculate the vector along the original segment
    const segmentVector = { x: end.x - start.x, y: end.y - start.y }

    //Calculate the unit vector in the direction of the original segment
    const unitSegmentVector = {
        x: segmentVector.x / Math.sqrt(segmentVector.x * segmentVector.x + segmentVector.y * segmentVector.y),
        y: segmentVector.y / Math.sqrt(segmentVector.x * segmentVector.x + segmentVector.y * segmentVector.y),
    }

    //Calculate the new endpoint
    const newEnd = {
        x: end.x + unitSegmentVector.x * extensionLength,
        y: end.y + unitSegmentVector.y * extensionLength,
    }

    //Return the extended segment
    return { start, end: newEnd }
}

function closestPointsBetweenSegments(segment1: LineSegment, segment2: LineSegment): (Point | undefined)[] {
    //console.log('segment1', segment1)
    //console.log('segment2', segment2)

    //see if they intersect
    const intersection = intersectionSegmentSegment(segment1, segment2)
    if (!!intersection) {
        return [intersection, intersection]
    }

    const closestPoints: Point[] = [{ x: 0, y: 0 }, { x: 0, y: 0 }]

    const v1 = subtractPoints(segment1.end, segment1.start)
    const v2 = subtractPoints(segment2.end, segment2.start)
    const w = subtractPoints(segment1.start, segment2.start)

    const a = dotProduct(v1, v1)
    const b = dotProduct(v1, v2)
    const c = dotProduct(v2, v2)
    const d = dotProduct(v1, w)
    const e = dotProduct(v2, w)

    const denominator = a * c - b * b

    let t1, t2

    if (denominator !== 0) {
        t1 = Math.max(0, Math.min(1, (b * e - c * d) / denominator))
        t2 = Math.max(0, Math.min(1, (a * e - b * d) / denominator))
        closestPoints[0] = {
            x: segment1.start.x + t1 * v1.x,
            y: segment1.start.y + t1 * v1.y,
        }

        closestPoints[1] = {
            x: segment2.start.x + t2 * v2.x,
            y: segment2.start.y + t2 * v2.y,
        }

        return closestPoints
    } else {
        //TODO handle parallel segments
        console.log('parallel')

        //check the end points in a specific order
        //1start to 2
        let s1ss2 = distancePointSegment(segment1.start, segment2)
        //1 end to 2
        let s1es2 = distancePointSegment(segment1.end, segment2)

        //2 start to 1
        let s2ss2 = distancePointSegment(segment2.start, segment1)

        //2 end to 1
        let s2es2 = distancePointSegment(segment2.end, segment1)

        t1 = 0
        t2 = Math.max(0, Math.min(1, -d / c))
        return [undefined, undefined]
    }
}

export function intersectingSegment(circle: WorldObject, end: Point, polygon: Point[]): LineSegment | undefined {
    //console.log('circle', circle.location)
    //console.log('end', end)
    //console.log('polygon', JSON.stringify(polygon))
    const rightRay = convertToRay(getParallelLine({ start: circle.location, end: end }, circle.radiusX))
    const centerRay = convertToRay({ start: circle.location, end: end })
    const leftRay = convertToRay(getParallelLine({ start: circle.location, end: end }, -circle.radiusX))

    //collector variables
    let closestIntersectionDistance: number | undefined = undefined
    let intersectingSegment: LineSegment | undefined = undefined
    let centerIntersect = false

    polygon.forEach((a, i) => {
        //console.log('side', i)
        //get the next point, wrapping at the end
        const b = polygon[i == polygon.length - 1 ? 0 : i + 1]
        const segment2 = { start: a, end: b }
        let ci = false
        //console.log(segment2)

        //if the center ray intersects with a different segment 
        if (!!intersectionRaySegment(centerRay, segment2)) {
            ci = true
            //console.log('center hit this segment')
        }

        const rightIntersection = intersectionRaySegment(rightRay, segment2)
        const leftIntersection = intersectionRaySegment(leftRay, segment2)
        let ld = undefined
        let rd = undefined
        if (!!rightIntersection) {
            rd = distancePointSegment(circle.location, segment2)
        }
        if (!!leftIntersection) {
            ld = distanceBetweenPoints(leftIntersection, circle.location)
        }
        let intersection
        let d
        if (!!rd && !!ld) {
            if (ld < rd) {
                intersection = leftIntersection
                d = ld
                //console.log('left side is closest')
            }
            else {
                intersection = rightIntersection
                d = ld
                //console.log('right side is closest')
            }
        }
        else if (!!rd) {
            intersection = rightIntersection
            d = rd
            //console.log('right side is closest')
        }
        else if (!!ld) {
            intersection = leftIntersection
            d = ld
            //console.log('left side is closest')
        }

        if (!!intersection && !!d) {
            //console.log('intersectingSegment', intersectingSegment)
            //console.log('closestIntersectionDistance', closestIntersectionDistance)
            //console.log('d', d)

            if (
                //first segment we hit at all
                closestIntersectionDistance == undefined ||
                //or its the closest segment so far and the centerRay hits it
                (d < closestIntersectionDistance && ci == true) ||
                //or its the closes segment so far and the center ray hasnt hit anything yet
                (d < closestIntersectionDistance && centerIntersect == false) ||
                //or is the first segment that the center hits
                (centerIntersect == false && ci == true)) {
                //console.log('is closest so far segment')
                closestIntersectionDistance = d
                intersectingSegment = segment2
                if (ci) {
                    centerIntersect = true
                }
            }
        }
    })
    //console.log('intersectingSegment', intersectingSegment)
    return intersectingSegment
}

function calculateLine(segment: LineSegment): { m: number | undefined, b: number } {
    const dx = segment.end.x - segment.start.x

    // Check if the line is vertical
    if (dx === 0) {
        return {
            m: undefined, // Slope is undefined for vertical lines
            b: segment.start.x, // x-coordinate of the vertical line
        }
    }

    const m = (segment.end.y - segment.start.y) / dx
    const b = segment.start.y - m * segment.start.x

    return { m, b }
}

export function intersectionLineLine(segment1: LineSegment, segment2: LineSegment): Point | undefined {
    const line1 = calculateLine(segment1)
    const line2 = calculateLine(segment2)

    // Check if either or both lines are vertical
    if (line1.m === undefined && line2.m === undefined) {
        // Both lines are vertical, check if they overlap on the same x-coordinate
        if (line1.b === line2.b) {
            return { x: line1.b, y: (segment1.start.y + segment1.end.y + segment2.start.y + segment2.end.y) / 4 }
        } else {
            return undefined // Parallel vertical lines with different x-coordinates, no intersection
        }
    }

    if (line1.m === undefined && line2.m !== undefined) {
        // Line 1 is vertical, calculate intersection using Line 2's parameters
        const y = line2.m * line1.b + line2.b
        return { x: line1.b, y }
    }

    if (line2.m === undefined && line1.m !== undefined) {
        // Line 2 is vertical, calculate intersection using Line 1's parameters
        const y = line1.m * line2.b + line1.b
        return { x: line2.b, y }
    }

    // Check if lines are parallel (same slope)
    if (line1.m === line2.m) {
        return undefined // No intersection
    }

    if (line1.m == undefined || line2.m == undefined) {
        console.log('wat4')
        return undefined
    }

    // Calculate intersection point
    const x = (line2.b - line1.b) / (line1.m - line2.m)
    const y = line1.m * x + line1.b

    return { x, y }
}

function arePointsCollinear(p1: Point, p2: Point, p3: Point): boolean {
    return dotProduct(subtractVectors(p2, p1), subtractVectors(p3, p1)) === 0
}

function convertToRay(lineSegment: LineSegment): Ray {
    const origin = lineSegment.start
    const direction = normalizeVector(subtractVectors(lineSegment.end, lineSegment.start))

    return { origin, direction }
}

export function angleToVector(angle: number): Point {
    // Calculate the components of the vector
    const xComponent = Math.cos(angle)
    const yComponent = Math.sin(angle)

    // Calculate the magnitude of the vector
    const magnitude = Math.sqrt(xComponent ** 2 + yComponent ** 2)

    // Create a normalized vector
    const normalizedVector = { x: xComponent / magnitude, y: yComponent / magnitude }

    return normalizedVector
}

function getParallelLine(lineSegment: LineSegment, distance: number): LineSegment {
    const segmentVector = normalizeVector(subtractVectors(lineSegment.end, lineSegment.start))

    //Calculate the perpendicular vector by rotating the normalized direction vector by 90 degrees
    const perpendicularVector = { x: -segmentVector.y, y: segmentVector.x }

    //Scale the perpendicular vector by the given distance
    const scaledPerpendicularVector = multiplyVectorByScalar(perpendicularVector, distance)

    //Create two new points for the parallel line by adding the scaled perpendicular vector to each endpoint
    const parallelLineStart = addVectors(lineSegment.start, scaledPerpendicularVector)
    const parallelLineEnd = addVectors(lineSegment.end, scaledPerpendicularVector)

    return { start: parallelLineStart, end: parallelLineEnd }
}

function addVectors(v1: Point, v2: Point): Point {
    return { x: v1.x + v2.x, y: v1.y + v2.y }
}

function multiplyVectorByScalar(vector: Point, scalar: number): Point {
    return { x: vector.x * scalar, y: vector.y * scalar }
}

function subtractPoints(p1: Point, p2: Point): Point {
    return { x: p1.x - p2.x, y: p1.y - p2.y }
}

function subtractVectors(v1: Point, v2: Point): Point {
    return { x: v1.x - v2.x, y: v1.y - v2.y }
}

function calculateNewPoint(startingPoint: Point, vector: Point): Point {
    //Calculate the new point
    const newPoint = {
        x: startingPoint.x + vector.x,
        y: startingPoint.y + vector.y,
    }

    return newPoint
}

function closestVectorToTarget(targetVector: Point, vectors: Point[]): Point {
    if (vectors.length === 0) {
        return { x: 0, y: 0 } //No vectors in the list
    }

    let closestVector = vectors[0]
    let closestDistance = distanceBetweenPoints(targetVector, closestVector)

    for (let i = 1; i < vectors.length; i++) {
        const currentVector = vectors[i]
        const currentDistance = distanceBetweenPoints(targetVector, currentVector)

        if (currentDistance < closestDistance) {
            closestVector = currentVector
            closestDistance = currentDistance
        }
    }
    return closestVector
}

function dotProduct(v1: Point, v2: Point): number {
    return v1.x * v2.x + v1.y * v2.y
}

function closestPointOnSegment({ start, end }: LineSegment, point: Point): Point {
    const A = point.x - start.x,
        B = point.y - start.y,
        C = end.x - start.x,
        D = end.y - start.y

    const segLenSq = C ** 2 + D ** 2
    const t = (segLenSq != 0) ? (A * C + B * D) / segLenSq : -1

    return (t < 0) ? start : (t > 1) ? end : {
        x: start.x + t * C,
        y: start.y + t * D
    }
}

function perpendicularPoint(lineSegment: LineSegment, referencePoint: Point, distance: number): Point {
    //get the closest point on the segment
    const a = closestPointOnSegment(lineSegment, referencePoint)

    const b = pointOnRay({ origin: a, direction: referencePoint }, distance)
    return b
}

function closestPointPoints(referencePoint: Point, points: Point[]): Point | undefined {
    if (points.length === 0) {
        return undefined
    }

    let closestPoint = points[0]
    let closestDistance = distanceBetweenPoints(referencePoint, closestPoint)

    for (let i = 1; i < points.length; i++) {
        const currentPoint = points[i]
        const currentDistance = distanceBetweenPoints(referencePoint, currentPoint)

        if (currentDistance < closestDistance) {
            closestPoint = currentPoint
            closestDistance = currentDistance
        }
    }
    return closestPoint
}

export function distanceBetweenPoints(p1: Point, p2: Point) {
    const deltaX = p2.x - p1.x
    const deltaY = p2.y - p1.y
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    return distance
}

export function intersectionSegmentSegment(segment1: LineSegment, segment2: LineSegment): Point | undefined {
    const { start: p1, end: q1 } = segment1
    const { start: p2, end: q2 } = segment2

    const orientation = (p: Point, q: Point, r: Point): number => {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
        if (val === 0) return 0 //Collinear
        return val > 0 ? 1 : 2 //Clockwise or counterclockwise
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

    //General case
    if (orientation1 !== orientation2 && orientation3 !== orientation4) {
        const intersectionX =
            ((p1.x * q1.y - p1.y * q1.x) * (p2.x - q2.x) - (p1.x - q1.x) * (p2.x * q2.y - p2.y * q2.x)) /
            ((p1.x - q1.x) * (p2.y - q2.y) - (p1.y - q1.y) * (p2.x - q2.x))

        const intersectionY =
            ((p1.x * q1.y - p1.y * q1.x) * (p2.y - q2.y) - (p1.y - q1.y) * (p2.x * q2.y - p2.y * q2.x)) /
            ((p1.x - q1.x) * (p2.y - q2.y) - (p1.y - q1.y) * (p2.x - q2.x))

        const intersectionPoint: Point = { x: intersectionX, y: intersectionY }

        //Check if the intersection point lies on both line segments
        if (onSegment(p1, intersectionPoint, q1) && onSegment(p2, intersectionPoint, q2)) {
            return intersectionPoint
        }
    }

    //No intersection
    return undefined
}

function isPointOnLineSegment(point: Point, segment: LineSegment): boolean {
    const { start, end } = segment

    //Check if the point is within the bounding box of the line segment
    if (
        (point.x >= Math.min(start.x, end.x) && point.x <= Math.max(start.x, end.x)) &&
        (point.y >= Math.min(start.y, end.y) && point.y <= Math.max(start.y, end.y))
    ) {
        //Calculate the cross product of the vectors formed by the point and the endpoints
        const crossProduct =
            (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y)

        //Allow for a small epsilon to handle floating-point imprecisions
        const epsilon = 1e-10

        //Check if the point is close enough to be considered on the line
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

function segmentToLine(segment: LineSegment): Line {
    return { a: segment.start, b: segment.end }
}

export function getNextPointOnCircle(center: Point, radius: number, currentPoint: Point, distanceToNextPoint: number): Point {
    // Calculate the angle corresponding to the current point
    const angleToCurrentPoint = Math.atan2(currentPoint.y - center.y, currentPoint.x - center.x);

    // Calculate the angle corresponding to the next point based on the distance
    const angleToNextPoint = angleToCurrentPoint + distanceToNextPoint / radius;

    // Calculate the coordinates of the next point
    const x = center.x + radius * Math.cos(angleToNextPoint);
    const y = center.y + radius * Math.sin(angleToNextPoint);

    return { x, y };
}
