"use client"
import EventEmitter from "events";
import { Player as Character } from "../app/worldSlice";
import { TURN_RIGHT, TURN_LEFT, DECELERATE, ACCELERATE, CHARACTER_LOCATION as CHARACTER_LOCATION } from "./CONSTANTS";

export default class GameEngine {

    characters: Character[] = [];
    currentPlayer!: Character;

    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    emit: (eventName: string | symbol, ...args: any[]) => boolean;
    eventNames: () => (string | symbol)[];
    constructor(eventEmitter: EventEmitter) {

        this.on = eventEmitter.on.bind(eventEmitter)
        this.emit = eventEmitter.emit.bind(eventEmitter)
        this.eventNames = eventEmitter.eventNames.bind(eventEmitter)

        this.on(TURN_RIGHT, () => {
            console.log('on', TURN_RIGHT)
        })
        this.on(TURN_LEFT, () => {
            console.log('on', TURN_LEFT)
        })
        this.on(DECELERATE, () => {
            console.log('on', DECELERATE)
        })
        this.on(ACCELERATE, () => {
            console.log('on', ACCELERATE)
        })

        this.on(CHARACTER_LOCATION,(character)=>{
            if (!this.characters.some((it) => {
                return it.id == character.id
            })) {
                console.log('adding the player')
                this.characters.push(character)
            }
        })
    }
}