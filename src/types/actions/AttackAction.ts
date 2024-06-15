import GameEngine from "@/GameEngine"
import { distanceBetweenPoints } from "@/Geometry"
import { roll } from "@/utility"
import Character from "../Character"
import * as LEVELS from "@/types/LEVELS.json"
import BaseAction from "./Action"

export default class AttackAction extends BaseAction {

    constructor({ action }: { action: AttackAction })
    constructor({ engine, character, targetId, triggerSocialAgro, triggerSocialAssist }: { engine: GameEngine, character: Character, targetId, triggerSocialAgro, triggerSocialAssist })
    constructor({ engine, character, action, targetId, triggerSocialAgro, triggerSocialAssist
    }) {
        super({ engine, character, action })
        if (!action) {
            this.targetId = targetId
            this.triggerSocialAgro = triggerSocialAgro
            this.triggerSocialAssist = triggerSocialAssist
            this.turn = engine.currentTurn + 1
            //remove any existing attack actions and add this one to the front
            character.target = this.targetId
            //TODO add the attack action to the front or end?
            const actions = [...character.actions.filter((action: BaseAction) => { return action.type != 'attack' }), this]
            character.actions = actions
        }
    }
    type: 'attack' = 'attack'
    triggerSocialAgro: boolean
    triggerSocialAssist: boolean
    targetId?: string
    do({ engine, character }: { engine: GameEngine, character: Character }) {
        console.log('attack action do')
        //TODO only do on the server
        //get the target
        const target = engine.getCharacter(this.targetId)
        if (target && !!target.id) {
            //if the target is dead already, stop attacking it
            //TODO this might not belong here
            if (target.hp <= -10) {
                engine.removeAttackAction(character.id)
                //updatedCharacters.add(character.id)
            }

            //check range
            const distance = distanceBetweenPoints(target.location, character.location)
            if (distance <= (target.radiusX + character.radiusX) * 1.1) {
                //console.log('distance', distance)
                //always spend an action
                character = engine.updateCharacter({ id: character.id, actionsRemaining: character.actionsRemaining - 1 })
                    .getCharacter(character.id)!
                //updatedCharacters.add(character.id)

                //handle multiple attacks
                character.bab.forEach((bab) => {
                    //roll for attack
                    const attack = roll({ size: 20, modifier: bab })
                    character.events.push({ target: character!.id, type: 'roll', amount: attack, time: new Date().getTime() })

                    if (attack > 10) {
                        //console.log('hit', attack)
                        //roll for damage
                        const damage = roll({ size: 6 })
                        character.events.push({ target: character!.id, type: 'roll', amount: damage, time: new Date().getTime() })

                        //update the target's hp, clamped to -10 and maxHp
                        character.takeDamage({ engine, damage })
                        //updatedCharacters.add(target.id)
                        //if the target was alive but now its dieing
                        if (target.hp > 0 && target.hp <= damage) {
                            //give xp
                            //TODO add an event for killing a character
                            character = engine.updateCharacter({ id: character.id, xp: character.xp + engine.calculateXp([], []) })
                                .getCharacter(character.id)!
                            //updatedCharacters.add(character.id)
                            //levelup check
                            if (character.xp >= LEVELS[(character.level + 1).toString() as keyof typeof LEVELS]) {
                                character = engine.updateCharacter({ id: character.id, level: character.level + 1 })
                                    .getCharacter(character.id)!
                                //TODO add an event for leveling up
                                //updatedCharacters.add(character.id)
                            }
                            //its(the target) (almost)dead, Jim
                            //both characters stop attacking
                            engine.removeAttackAction(character.id)
                            //updatedCharacters.add(character.id)

                            //TODO this can probably go in a more general place when its the target's turn
                            engine.removeAttackAction(target.id)
                            //updatedCharacters.add(target.id)
                        }
                        target.events.push({ target: target.id, type: 'attack', amount: damage, time: new Date().getTime() })
                    }
                    else {
                        //console.log('miss', attack)
                        target.events.push({ target: target!.id, type: 'miss', amount: 0, time: new Date().getTime() })
                    }
                })
                //done doing attacks
                console.log('call for help')
                //call for help 
                if (this.triggerSocialAgro) {
                    const helper = engine.recruitHelp(target, false)
                    //updatedCharacters.add(helper.id)
                }
                if (!target.target) {
                    //fight back
                    const triggerSocialAgro = false
                    const triggerSocialAssist = true
                    engine.addAttackAction(target.id, character.id, triggerSocialAgro, triggerSocialAssist)
                    //updatedCharacters.add(target.id)
                }
            }
            else {
                //TODO too far away, but not every tick, like once a second or something maybe
                //console.log('too far away', distance)
                //gameEvents.push({ target: target.id, type: 'to_far_away', amount: 0, time: now })
            }
        }
    }
}