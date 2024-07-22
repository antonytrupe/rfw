import GameEngine from "@/GameEngine"
import Character from "../Character"
import BaseAction, { Action, CONTINUOUS } from "./Action"
import { calculateRotationAcceleration, distanceBetweenPoints, getRotation } from "@/Geometry"
import Point from "../Point"

export default class MoveAction extends BaseAction {
    type: 'move' = 'move'
    speedAcceleration: number = 0
    /**
     * 1 for walk, 2 for  run, .5 for stealth, .25 for crawl, 0 for imobilized or paralyzed
     */
    mode: number = 1
    rotationSpeed: number = 0
    speed: number = 0

    constructor({ engine, character, action }: {
        engine: GameEngine, character: Character, action: Partial<MoveAction>
    }) {
        super({ engine, character, action })
        const oldAction = character.actions.find((action: BaseAction) => action.type == 'move') as MoveAction

        Object.assign(this, oldAction)
        Object.assign(this, action)

        this.turn = CONTINUOUS

        //remove old moveaction
        if (!!oldAction) {
            character.actions = [...character.actions.filter((action: Action) => { return action.type !== 'move' })]
        }

        //add the action to the front of the array
        character.actions.splice(0, 0, this)

    }

    /**
     * this action updates the characters rotation and speed acceleration values
      */
    do({ engine, character, dt, now }: { engine: GameEngine, character: Character, dt: number, now: number }) {
        //console.log('do moveAction', character.id)

        //calculate the new angle
        let newRotation = engine.calculateRotation(character, this, dt)

        //TODO if they went over their walk speed or they went over their walk distance, then consume an action
        //TODO if they don't have an action to use for running, don't let them run
        let newSpeed = engine.calculateSpeed(character, this, dt / 2)
        //console.log('newSpeed1', newSpeed)

        let newPosition = engine.calculatePosition(character, { ...this, speed: newSpeed }, dt)
        //console.log('newPosition1', newPosition)

        newSpeed = engine.calculateSpeed(character, { ...this, speed: newSpeed }, dt / 2)
        //console.log('newSpeed2', newSpeed)

        //check for collisions
        newPosition = engine.slide(character, newPosition)
        //console.log('newPosition2', newPosition)

        engine.updateCharacter({ id: character.id, location: newPosition, rotation: newRotation })

        this.speed = newSpeed

        //make sure the character is in next turn's list of active characters
        if (this.rotationSpeed !== 0 || this.speedAcceleration !== 0 || this.speed !== 0) {
            engine.addActiveCharacter(CONTINUOUS, character.id)
        }
        else if (this.rotationSpeed === 0 && this.speedAcceleration === 0 && this.speed === 0) {
            engine.removeActiveCharacter(CONTINUOUS, character.id)
        }
    }
}