import isEqual from "lodash.isequal"
import Character from "./types/Character"
import { Zones, Zone, Zones2, Zone2 } from "./types/Zones"
import { Point } from "./types/Point"
import WorldObject from "./types/WorldObject"

//keeps track of the world state and has helper functions to interact with world state
//keeps track of rooms/zones/regions and what's in them
//doesn't know anything about client/server
export default class GameWorld {

    //needs to be private to force going through a setter to keep the zones up to date
    private characters: Map<string, Character> = new Map<string, Character>()
    private worldObjects: Map<string, WorldObject> = new Map<string, WorldObject>()

    //a character is always in 1 tactical zone
    //a map of zones
    //the keys are zone names
    //
    //the entries are just a list of character ids
    private zones: Zones = new Map<string, Zone>()

    restart() {
        this.characters = new Map<string, Character>()
        this.zones = new Map<string, Zone>()
    }

    updateWorldObjects(objects: WorldObject[]) {
        objects.forEach((object) => {
            this.updateWorldObject(object)
        })
        return this
    }

    updateWorldObject(worldObject: Partial<WorldObject>): GameWorld {
        //if we don't have a character id, give up
        //console.log('character.id',character.id)
        if (!worldObject?.id) {
            return this
        }

        const old: WorldObject | undefined = this.worldObjects.get(worldObject.id)
        //console.log('old',old)
        const merged: WorldObject = { ...new Character({}), ...old, ...worldObject }

        if ((!merged.location.x && merged.location.x != 0) || (!merged.location.y && merged.location.y != 0)) {
            //bail if it doesn't have a location
            return this
        }

        //bail if nothing is changing
        if (isEqual(old, merged)) {
            //console.log('nothing changed')
            return this
        }

        //console.log('got past sanity checks')
        const newZoneName = this.getTacticalZoneName(merged.location)
        let newZone = this.zones.get(newZoneName)
        let updatedZones = new Map<string, Set<string>>()

        //if the new zone doesn't exist
        if (!newZone) {
            //create it and add them to it
            newZone = new Set([worldObject.id])
            this.zones.set(newZoneName, newZone)
        }

        //the new zone exists but they're not in it
        if (!Array.from(newZone.values()).includes(worldObject.id)) {
            newZone.add(worldObject.id)
            updatedZones.set(newZoneName, newZone)
        }

        if (!!old) {
            //updating existing character
            //clean up old zone
            const oldZoneName = this.getTacticalZoneName(old.location)
            //if the oldzonename is different then the newzone name
            if (oldZoneName != newZoneName) {
                //remove them from the old zone
                let oldZone = this.zones.get(newZoneName)
                if (oldZone) {
                    //let i = oldZone.indexOf(character.id)
                    oldZone.delete(worldObject.id)
                    updatedZones.set(oldZoneName, oldZone)
                }
            }
        }

        this.worldObjects.set(merged.id, merged)
        return this
    }


    updateCharacters(characters: Character[]): GameWorld {
        characters.forEach((character) => {
            this.updateCharacter(character)
        })
        return this
    }

    getAllCharacters() {
        return this.characters
    }

    getAllWorldObjects() {
        return this.worldObjects
    }

    getCharactersNearPoint({ location, distance }: { location: Point, distance: number }): Character[] {
        //TODO make this smarter and use zones
        return Array.from(this.characters.values()).filter((character): boolean => {
            const a = location.x - character.location.x
            const b = location.y - character.location.y
            const d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
            return d <= distance
        })
    }

    getCharactersNearSegment({ start, stop, width }: { start: Point, stop: Point, width: number }): Character[] {
        //TODO make this smarter and use zones
        return Array.from(this.characters.values()).filter((character): boolean => {
            const d = this.getDistancePointSegment({ start, stop, point: character.location }) - character.radiusX
            return d < width
        })
    }

    getObjectsNearSegment({ start, stop, width }: { start: Point, stop: Point, width: number }): WorldObject[] {
        return Array.from(this.worldObjects.values()).filter((wo): boolean => {
            const d = this.getDistancePointSegment({ start, stop, point: wo.location }) - wo.radiusX
            return d < width
        })
    }

    getDistancePointSegment({ point: { x, y }, start: { x: x1, y: y1 }, stop: { x: x2, y: y2 } }: { point: Point, start: Point, stop: Point }) {
        var A = x - x1;
        var B = y - y1;
        var C = x2 - x1;
        var D = y2 - y1;

        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;

        var xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        var dx = x - xx;
        var dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getObjectsNearPoint({ location, distance }: { location: Point, distance: number }): WorldObject[] {
        //TODO make this smarter and use zones
        return Array.from(this.worldObjects.values()).filter((wo): boolean => {
            const a = location.x - wo.location.x
            const b = location.y - wo.location.y
            const d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
            return d <= distance
        })
    }

    getCharactersWithin({ top, bottom, left, right }: { top: number, bottom: number, left: number, right: number }): Character[] {
        //TODO make this smarter and use zones
        return Array.from(this.characters.values()).filter((character): boolean => {
            return top <= character.location.y && bottom >= character.location.y && left <= character.location.x && right >= character.location.x
        })
    }

    getCharactersInZones(zones: Set<string>): Character[] {
        const characters: Character[] = Array.from(this.zones.entries()).filter(([zoneName,]) => {
            return zones.has(zoneName)
        }).map(([, characters]) => {
            return this.getCharacters(Array.from(characters.values()))
        }).flat()
        return characters
    }

    getObjectsInZones(zones: Set<string>): WorldObject[] {
        const worldObjects: WorldObject[] = Array.from(this.zones.entries()).filter(([zoneName,]) => {
            return zones.has(zoneName)
        }).map(([, objects]) => {
            return this.getWorldObjects(Array.from(objects.values()))
        }).flat()
        return worldObjects
    }

    getCharactersIntoZones(characterIds: string[]): Zones2 {
        const zones = new Map<string, Zone2>()
        characterIds.forEach((characerId) => {
            const character = this.getCharacter(characerId)!

            const zoneName = this.getTacticalZoneName(character.location)

            let zone: Zone2 | undefined = zones.get(zoneName)
            if (!zone) {
                zone = new Map<string, Character | undefined>()
            }
            zone.set(characerId, character)
            zones.set(zoneName, zone)
        })
        return zones
    }

    getCharacter(characterId: string | undefined): Character | undefined {
        if (!characterId) {
            return
        }
        return this.characters.get(characterId)
    }

    getTacticalZoneName({ x, y }: Point) {
        //T tactical/one turn
        //M local/10 turns/1 minute
        //H overland/one hour
        //D overland/one day
        //name them by top left point
        const fx = Math.floor(x / 30)
        const fy = Math.floor(y / 30)
        return 'T:' + fx + ':' + fy
    }

    /**
     * ONLY send updated values, don't update the whole character and send it
     * @param character the values that we want to change 
     * @returns 
     */
    updateCharacter(character: Partial<Character>): GameWorld {
        //if we don't have a character id, give up
        //console.log('character.id',character.id)
        if (!character?.id) {
            return this
        }

        const old: Character | undefined = this.characters.get(character.id)
        //console.log('old',old)
        const merged: Character = { ...new Character({}), ...old, ...character }

        if ((!merged.location.x && merged.location.x != 0) || (!merged.location.y && merged.location.y != 0)) {
            //bail if it doesn't have a location
            return this
        }

        //bail if nothing is changing
        if (isEqual(old, merged)) {
            //console.log('nothing changed')
            return this
        }

        //console.log('got past sanity checks')
        const newZoneName = this.getTacticalZoneName(merged.location)
        let newZone = this.zones.get(newZoneName)
        let updatedZones = new Map<string, Set<string>>()

        //if the new zone doesn't exist
        if (!newZone) {
            //create it and add them to it
            newZone = new Set([character.id])
            this.zones.set(newZoneName, newZone)
        }

        //the new zone exists but they're not in it
        if (!Array.from(newZone.values()).includes(character.id)) {
            newZone.add(character.id)
            updatedZones.set(newZoneName, newZone)
        }

        if (!!old) {
            //updating existing character
            //clean up old zone
            const oldZoneName = this.getTacticalZoneName(old.location)
            //if the oldzonename is different then the newzone name
            if (oldZoneName != newZoneName) {
                //remove them from the old zone
                let oldZone = this.zones.get(newZoneName)
                if (oldZone) {
                    //let i = oldZone.indexOf(character.id)
                    oldZone.delete(character.id)
                    updatedZones.set(oldZoneName, oldZone)
                }
            }
        }

        this.characters.set(merged.id, merged)
        return this
    }

    getAdjacentTacticalZoneNames() {
        //TODO getAdjacentTacticalZoneNames
    }

    getCharacterAt(position: Point): Character | undefined {
        const l = this.getCharactersAt(position)
        if (l.length > 0) {
            return l[0]
        }
        return undefined
    }

    getCharactersAt(position: Point): Character[] {
        //TODO take into account characters that overlap into adjacent zones
        //get the zone that includes this point
        const zoneName = this.getTacticalZoneName(position)
        //console.log(zoneName)
        const zone = this.zones.get(zoneName)
        //make sure we got a zone
        if (!!zone) {
            //create a list of characters out of the list of characterids
            const characters: Character[] = Array.from(zone).reduce((result: Character[], characterId: string) => {
                //get the character object
                const character = this.characters.get(characterId)

                if (character) {
                    const distance = Math.sqrt(
                        Math.pow(character.location.x - position.x, 2) +
                        Math.pow(character.location.y - position.y, 2))
                    //console.log('distance', distance)
                    if (distance < character.radiusX) {
                        result.push(character)
                    }
                }
                return result
            }, [])
            return characters
        }
        return []
    }

    getCharacters(ids: string[]): Character[] {
        let l: Character[] = []
        ids.forEach((id) => {
            const c = this.characters.get(id)
            if (c)
                l.push(c)
        })
        return l
    }

    private getWorldObjects(ids: string[]): WorldObject[] {

        let l: WorldObject[] = []
        ids.forEach((id) => {
            const c = this.worldObjects.get(id)
            if (c)
                l.push(c)
        })
        return l
    }
}