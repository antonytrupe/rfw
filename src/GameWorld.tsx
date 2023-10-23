import Character from "./Character";

export default class GameWorld {
    updateCharacter(character: Partial<Character>) {
        const i = this.characters.findIndex((it): boolean => {
            //look for an existing character to update
            return it.id == character.id
        })
        if (i >= 0) {
            //console.log('updated existing character')
            this.characters.splice(i, 1, { ...this.characters[i], ...character })
        } else {
            //we didn't find an existing character, so add a new one
            this.characters.push({ ...new Character({}), ...character })
        }
        return character
    }
    findCharacters(position: { x: number, y: number }) {
        return this.characters.filter((character): boolean => {
            const distance = Math.sqrt(
                Math.pow(character.x - position.x, 2) +
                Math.pow(character.y - position.y, 2))
            //console.log('distance', distance)
            return distance < character.size / 2
        })
    }
    characters: Character[] = [];
    currentPlayer!: Character;
    constructor(characters: Character[]) {
        this.characters = characters
    }
}