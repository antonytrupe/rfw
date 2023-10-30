import Character from "./Character";

//keeps track of the world state and has helper functions to interact with world state
//keeps track of rooms/zones/regions and what's in them
//doesn't know anything about client/server
export default class GameWorld {
    updateCharacters(characters: Map<string, Character>) {
        characters.forEach((character) => {
            this.updateCharacter(character)
        })
    }
    //needs to be private to force going through a setter to keep the zones up to date
    private characters: Map<string, Character> = new Map<string, Character>()
    //a character is always in 1 tactical zone
    //a map of zones
    //the keys are zone names
    //
    //the entries are just a list of character ids
    zones: Map<string, string[]> = new Map<string, string[]>()

    getAllCharacters() {
        return this.characters
    }

    getCharactersWithin({ top, bottom, left, right }: { top: number, bottom: number, left: number, right: number }): Character[] {
        //TODO make this smarter and use zones
        return Array.from(this.characters.values()).filter((character): boolean => {
            return top <= character.y && bottom >= character.y && left <= character.x && right >= character.x
        })
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

    updateCharacter(character: Partial<Character>) {
        //if we don't have a character id, give u p
        if (!character.id) {
            return
        }

        const old: Character | undefined = this.characters.get(character.id)
        const merged = { ...new Character({}), ...old, ...character }

        if (!merged.x || !merged.y) {
            //bail if it doesn't have a location
            return
        }

        const newZoneName = this.getTacticalZoneName({ x: merged.x, y: merged.y })
        let newZone = this.zones.get(newZoneName);

        //if the new zone doesn't exist
        if (!newZone) {
            //create it and add them to it
            this.zones.set(newZoneName, [character.id])
        }
        //the new zone exists but they're not in it
        else if (!Array.from(newZone.values()).includes(character.id)) {
            newZone.push(character.id)
        }

        if (!!old) {
            //updating existing character
            //clean up old zone
            const oldZoneName = this.getTacticalZoneName({ x: old.x, y: old.y })
            //if the oldzonename is different then the newzone name
            if (oldZoneName != newZoneName) {
                //remove them from the old zone
                let oldZone = this.zones.get(newZoneName);
                if (oldZone) {
                    let i = oldZone.indexOf(character.id)
                    oldZone.splice(i, 1)
                }
            }
        }

        this.characters.set(merged.id, merged)
        return merged
    }

    getCharactersAt(position: { x: number, y: number }): Character[] {
        //  get the zone that includes this point
        const zoneName = this.getTacticalZoneName(position)
        //  console.log(zoneName)
        const zone = this.zones.get(zoneName)
        //  console.log(zone)
        //make sure we got a zone0
        if (!!zone) {
            //create a list of characters out of the list of characterids
            const characters: Character[] = zone.reduce((result: Character[], characterId) => {
                //get the character object
                let character = this.characters.get(characterId)

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

    getCharacters(ids: string[]) {
        return ids.map((id) => {
            return this.characters.get(id)
        })
    }
}