import { BaseTypes, DynamicObject } from 'lance-gg';

export default class Character extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.health = 0;
    }

    static get netScheme() {
        return Object.assign({
            health: { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.health = other.health;
    }
}