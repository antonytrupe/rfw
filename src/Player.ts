export default class Player {

    constructor({
        email = "",
        id = "",
        claimedCharacters = [],
        selectedCharacter = '',
        controlledCharacter = ''
    }: {
        email?: string
        id?: string
        claimedCharacters?: string[]
        selectedCharacter?: string
        controlledCharacter?: string
    }) {
        this.email = email
        this.id = id
        this.claimedCharacters = claimedCharacters
        this.selectedCharacter = selectedCharacter
        this.controlledCharacter = controlledCharacter
    }
    email: string
    id: string
    claimedCharacters: string[]
    selectedCharacter: string
    controlledCharacter: string
}

