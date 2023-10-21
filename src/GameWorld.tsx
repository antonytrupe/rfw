import { Character } from "../app/worldSlice";

export default class GameWorld {
    updateCharacter(character: any) {
        const i = this.characters.findIndex((it) => {
            //look for an existing character to update
            return it.id == character.id
        })
        if (i >= 0) {
            this.characters.splice(i, 1, character)
        } else {
            //we didn't find an existing character, so add a new one
            this.characters.push(character)
        }
    }
    findCharacters(position: { x: number, y: number }) {
        return this.characters.filter((character) => {
            const distance = Math.sqrt(
                Math.pow(character.location.x - position.x, 2) +
                Math.pow(character.location.y - position.y, 2))
            //console.log('distance', distance)
            return distance < character.size
        })
    }
    characters: Character[] = [];
    currentPlayer!: Character;
    constructor() {
    }
}