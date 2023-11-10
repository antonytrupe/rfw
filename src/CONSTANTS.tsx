import Character from "./Character"
import { Zones } from "./GameWorld"

//client connect
export const CONNECT = 'connect'
//server connect
export const CONNECTION = 'connection'
//server and client socket disconnect
export const DISCONNECT = 'disconnect'
//message
export const MESSAGE_CLIENT_SEND = "message.client.send"
export const MESSAGE_SERVER_BROADCAST = "message.server.broadcast"

//db constants
export const CHARACTER_PATH = '/CHARACTER/'

export interface ViewPort {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export const CLIENT_INITIAL = 'client.initial'
export interface CLIENT_INITIAL_INTERFACE extends ViewPort { }

export const CURRENT_PLAYER = 'current_player'

export const SELECTED_CHARACTER = 'client.characters.selected'
export const CLAIMED_CHARACTERS = 'client.characters.claimed'

export const ATTACK = 'attack'

//serverengine to clientengine
//clientengine to gameengine
export const CLIENT_CHARACTER_UPDATE = 'world.character.location.client'
//gameengine to serverengine
export const SERVER_CHARACTER_UPDATE = 'world.character.location.server'
//tell the server to create a character
export const CREATE_CHARACTER = 'world.character.create'

export const CREATE_COMMUNITY = 'world.create_community'
//clientengine notify UI
//list of claimed characters, last selected character, last viewport
export const CLIENT_INFO = 'client.selected_characters.update'
export interface CLIENT_INFO_INTERFACE {
    claimedCharacters: Character[]
    selectedCharacters: Character[]
    scale: number,
    translateX: number,
    translateY: number
}

//ASDW key inputs
export const TURN_LEFT = 'world.character.turn.left'
export const TURN_RIGHT = 'world.character.turn.right'
export const TURN_STOP = 'world.character.turn.stop'
export const DECELERATE = 'world.character.decelerate'
export const ACCELERATE = 'world.character.accelerate'
//export const DECELERATE_DOUBLE = 'world.character.decelerate_double'
export const ACCELERATE_DOUBLE = 'world.character.accelerate_double'
export const STOP_ACCELERATE = 'world.character.stop_accelerate'
export const STOP_DOUBLE_ACCELERATE = 'world.character.stop_double_accelerate'
export const CAST_SPELL = 'world.character.cast_spell'
export const CLAIM_CHARACTER = 'world.character.claim'
export const CONTROL_CHARACTER = 'world.character.control'
export const TARGET_CHARACTER = 'world.character.targeted'