export default class Player {
    email: string
    id: string
    claimedCharacters: string[]
    controlledCharacter: string
    maxClaimedCharacters: number
   /* 
    progression: Map<PROGRESSION, boolean> = new Map([
        [PROGRESSION.ZOOM, false],
        [PROGRESSION.CLAIM_CHARACTER, false],
        [PROGRESSION.MOVEMENT, false]]
        
        )
*/

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
enum PROGRESSION {
    ZOOM,
    CLAIM_CHARACTER,
    MOVEMENT,
    CHAT,
    SHORT_REST,
    LONG_REST,
    FAST_TRAVEL,
    COMBAT,
    HEALTH,
    COMMANDS,
    JOB,
    DEATH,
    CLAIM_SECOND,
    CONTROL,
    UNCONTROL,
    SPELLS,
    XP, ABILITY_SCORES, LEVELS, INVENTORY
}
const PROGRESSION_ORDER: Map<number, PROGRESSION> = new Map([
    [1, PROGRESSION.ZOOM],
    [2, PROGRESSION.CLAIM_CHARACTER],
    [3, PROGRESSION.MOVEMENT],
    [4, PROGRESSION.CHAT],
    [5, PROGRESSION.SHORT_REST],
    [6, PROGRESSION.COMBAT],
    [7, PROGRESSION.HEALTH],
    [8, PROGRESSION.LONG_REST],
    [9, PROGRESSION.FAST_TRAVEL],
    [10, PROGRESSION.DEATH],
    [11, PROGRESSION.CLAIM_SECOND],
    [12, PROGRESSION.UNCONTROL],
    [13, PROGRESSION.CONTROL],
    [14, PROGRESSION.COMMANDS],
    [15, PROGRESSION.JOB],
])