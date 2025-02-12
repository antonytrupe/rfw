import GameEngine from "@/GameEngine"
import Character from "../Character"
import BaseAction, { Action, CONTINUOUS } from "./Action"
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
        this.turn = CONTINUOUS
    }

    /**
     * this action updates the characters rotation and speed acceleration values
     * @param param0 
     */
    do({ engine, character, dt, now }: { engine: GameEngine, character: Character, dt: number, now: number }) {
        //console.log('do moveToAction', character.name)

        const dist = distanceBetweenPoints(this.location, character.location)
        let targetRotation: number
        let rotationSpeed = 0
        let speedAcceleration = 0
        let actions = character.actions
        let move: MoveAction | undefined = character.actions.find((action) => action.type == "move") as MoveAction
        if (dist > character.radiusX) {
            //console.log('turn/accelerate/stop')
            targetRotation = getRotation(character.location, this.location)

            //turn right or left
            rotationSpeed = calculateRotationAcceleration(character.rotation, targetRotation)

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
                rotationSpeed = 0
                speedAcceleration = 0
            }
        }

        if (rotationSpeed == 0 && speedAcceleration == 0) {
            console.log('remove moveaction')
            //we got there, so clear all move actions
            actions = actions.filter((action) => { return action.type != 'moveTo' && action.type != 'move' })
            //engine.removeActiveCharacter(CONTINUOUS, character.id)
        }
        else {
            //update/add the move action 
            if (!move) {
                character.addAction(engine, new MoveAction({ engine, character, action: { rotationSpeed, speedAcceleration } }))
                //console.log(character.actions)
                //make sure moveto is first
                actions = character.actions.sort((a, b) => { return a.type == 'moveTo' ? -1 : 0 })
            }
            // move.rotationSpeed = turnRotation
            // move.speedAcceleration = speedAcceleration
        }

        engine.updateCharacter({
            id: character.id,
            actions: actions
        })
    }
}