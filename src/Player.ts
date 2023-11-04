export default class Player {

    constructor({
        email = "",
        id = "",
        claimedCharacters = [],
        selectedCharacters = []
    }: {
        email?: string
        id?: string
        claimedCharacters?: string[]
        selectedCharacters?: string[]
    }) {
        this.email = email
        this.id = id
        this.claimedCharacters = claimedCharacters
        this.selectedCharacters = selectedCharacters
    }
    email: string
    id: string
    claimedCharacters: string[]
    selectedCharacters: string[]
}

