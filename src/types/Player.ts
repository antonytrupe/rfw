export default class Player {
    email: string
    id: string
    claimedCharacters: string[]
    controlledCharacter: string
    maxClaimedCharacters: number

    constructor({
        email = "",
        id = "",
        claimedCharacters = [],
        controlledCharacter = '',
        maxClaimedCharacters = 2
    }: {
        email?: string
        id?: string
        claimedCharacters?: string[]
        controlledCharacter?: string
        maxClaimedCharacters?: number
    }) {
        this.email = email
        this.id = id
        this.claimedCharacters = claimedCharacters
        this.controlledCharacter = controlledCharacter
        this.maxClaimedCharacters = maxClaimedCharacters
    }
}