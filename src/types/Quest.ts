export default class Quest {
    id: string = '__quest__'
    name: string = '__quest__'
    description: string = '__quest__'
    unlocks: string[] = []
    repeatable: boolean = true
    tier: TIER = TIER.NORMAL
    scope: SCOPE = SCOPE.PLAYER
    available: () => {} = () => { return false }
    checkOnConnect: boolean = false

    constructor({ id, name, description, unlocks, repeatable, tier, scope }) {
        this.id = id
        this.name = name
        this.description = description
        this.unlocks = unlocks
        this.repeatable = this.repeatable
        this.tier = tier
        this.scope = scope
    }
}

enum TIER {
    TUTORIAL,
    ACHIEVEMENT,
    DAILY,
    NORMAL,
    TASK
}

enum SCOPE {
    CHARACTER,
    PLAYER
}

const quests = [
    new Quest({
        id: 0, name: "Zoom", description: "Use the scroll wheel or pinch or page up/down to zoom.",
        unlocks: [1], repeatable: false, tier: TIER.TUTORIAL, scope: SCOPE.PLAYER
    }),
    new Quest({
        id: 1, name: "Claim Character", description: "Double click on a character to claim it.",
        unlocks: [2], repeatable: false, tier: TIER.TUTORIAL, scope: SCOPE.PLAYER
    }),
    new Quest({
        id: 2, name: "Move Character", description: "Use the wasd keys or tap to move your character.",
        unlocks: [], repeatable: false, tier: TIER.TUTORIAL, scope: SCOPE.PLAYER
    }),
]


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