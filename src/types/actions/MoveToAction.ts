import GameEngine from "@/GameEngine"
import Character from "../Character"
import BaseAction, { Action } from "./Action"
import { calculateRotationAcceleration, distanceBetweenPoints, getRotation } from "@/Geometry"
import Point from "../Point"
import MoveAction from "./MoveAction"

export default class MoveToAction extends BaseAction {
    type: 'moveTo' = 'moveTo'
    location?: Point

    constructor({ action }: { action: MoveToAction })
    constructor({ engine, character, location }: { engine: GameEngine, character: Character, location: Point })
    constructor({ engine, character, location, action }: { engine?: GameEngine, character?: Character, location?: Point, action?: MoveToAction }) {
        super({ engine, character, action })
        if (!action) {
            this.location = location
            this.turn = engine.currentTurn
            //replace any existing moveTo actions
            if (character.actions.find((action: BaseAction) => action.type == 'moveTo')) {
                character.actions = [...character.actions.map((action: Action) => { return action.type == 'moveTo' ? this : action })]
            }
            //add a new moveTo action if there isn't one already
            else {
                //add the action to the front of the array
                character.actions.splice(0, 0, this)
            }
        }

    }

    /**
     * this action updates the characters rotation and speed acceleration values
     * @param param0 
     */
    do({ engine, character, dt, now }: { engine: GameEngine, character: Character, dt: number, now: number }) {
        //console.log('do moveToAction', character.name)

        const dist = distanceBetweenPoints(this.location, character.location)
        let targetRotation: number
        let turnRotation = 0
        let speedAcceleration = 0
        let actions = character.actions
        if (dist > character.radiusX) {
            //console.log('turn/accelerate/stop')
            targetRotation = getRotation(character.location, this.location)

            //turn right or left
            turnRotation = calculateRotationAcceleration(character.rotation, targetRotation)

            const move: MoveAction | undefined = character.actions.find((action) => action.type == "move")

            //accelerate or stop accelerating
            speedAcceleration = engine.calculateAcceleration(character, move, this.location)
        }

        //if the target is inside another character and we've collided, then stop trying to move any more
        let charactersAtTarget = engine.gameWorld.getCharactersNearPoint({ location: this.location, distance: character.radiusX * 2 })
            .filter((it) => {
                return (
                    //throw out the current character
                    it.id != character.id &&
                    //throw out dead characters
                    it.hp > -10)
            })
        if (charactersAtTarget.length > 0) {
            //console.log('characters at target')
            const dist = distanceBetweenPoints(character.location, charactersAtTarget[0].location)
            if (dist < (character.radiusX + charactersAtTarget[0].radiusX)) {
                //console.log('colliding with characters at target')
                turnRotation = 0
                speedAcceleration = 0
            }
        }

        if (turnRotation == 0 && speedAcceleration == 0) {
            //we got there, so clear all move actions
            actions = actions.filter((action) => { return action.type != 'moveTo' })
        }

        //TODO update/add the move action

        character = engine.updateCharacter({
            id: character.id,
            // rotationAcceleration: turnRotation,
            // speedAcceleration: speedAcceleration,
            actions: actions
        }).getCharacter(character.id)!
    }
}