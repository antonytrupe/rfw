export default class Player {

    constructor({
        email = "",
        id = "",
        claimedCharacters = [],
        selectedCharacters = [],
        controlledCharacter = ''
    }: {
        email?: string
        id?: string
        claimedCharacters?: string[]
        selectedCharacters?: string[]
        controlledCharacter?: string
    }) {
        this.email = email
        this.id = id
        this.claimedCharacters = claimedCharacters
        this.selectedCharacters = selectedCharacters
        this.controlledCharacter = controlledCharacter
    }
    email: string
    id: string
    claimedCharacters: string[]
    selectedCharacters: string[]
    controlledCharacter: string
}

