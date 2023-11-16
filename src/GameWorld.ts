import isEqual from "lodash.isequal"
import Character from "./Character"
import { Zones, Zone } from "./Zones"

//keeps track of the world state and has helper functions to interact with world state
//keeps track of rooms/zones/regions and what's in them
//doesn't know anything about client/server
export default class GameWorld {

    //needs to be private to force going through a setter to keep the zones up to date
    private characters: Map<string, Character> = new Map<string, Character>()
    //a character is always in 1 tactical zone
    //a map of zones
    //the keys are zone names
    //
    //the entries are just a list of character ids
    private zones: Zones = new Map<string, Zone>()

    updateCharacters(characters: Character[]): GameWorld {
        characters.forEach((character) => {
            this.updateCharacter(character)
        })
        return this
    }

    getAllCharacters() {
        return this.characters
    }

    getCharactersNearby({ x, y, r }: { x: number, y: number, r: number }): Character[] {
        //TODO make this smarter and use zones
        return Array.from(this.characters.values()).filter((character): boolean => {
            const a = x - character.x
            const b = y - character.y
            const d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
            return d <= r
        })
    }


    getCharactersWithin({ top, bottom, left, right }: { top: number, bottom: number, left: number, right: number }): Character[] {
        //TODO make this smarter and use zones
        return Array.from(this.characters.values()).filter((character): boolean => {
            return top <= character.y && bottom >= character.y && left <= character.x && right >= character.x
        })
    }

    getCharacter(characterId: string | undefined): Character | undefined {
        if (!characterId) {
            return
        }
        return this.characters.get(characterId)
    }

    getTacticalZoneName({ x, y }: { x: number, y: number }) {
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

        if ((!merged.x && merged.x != 0) || (!merged.y && merged.y != 0)) {
            //bail if it doesn't have a location
            return this
        }

        //bail if nothing is changing
        if (isEqual(old, merged)) {
            //console.log('nothing changed')
            return this
        }

        //console.log('got past sanity checks')
        const newZoneName = this.getTacticalZoneName({ x: merged.x, y: merged.y })
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
            const oldZoneName = this.getTacticalZoneName({ x: old.x, y: old.y })
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

    getCharacterAt(position: { x: number, y: number }): Character | undefined {
        const l = this.getCharactersAt(position)
        if (l.length > 0) {
            return l[0]
        }
        return undefined
    }

    getCharactersAt(position: { x: number, y: number }): Character[] {
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
                        Math.pow(character.x - position.x, 2) +
                        Math.pow(character.y - position.y, 2))
                    //console.log('distance', distance)
                    if (distance < character.size / 2) {
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
}