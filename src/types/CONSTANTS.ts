//datastore stuff
export const CHARACTER_DB_PATH = "data/characters"
export const PLAYER_DB_PATH = "data/players"
export const TEMPLATE_DB_PATH = "data/templates"
export const OBJECT_DB_PATH = "data/objects"
export const CHARACTER_KIND = 'CHARACTER'
export const OBJECT_KIND = 'OBJECT'
export const PLAYER_KIND = 'PLAYER'
export const TEMPLATE_KIND = 'TEMPLATE'

export const E = 0 / 4 * Math.PI
export const NE = 1 / 4 * Math.PI
export const N = 2 / 4 * Math.PI
export const NW = 3 / 4 * Math.PI
export const W = 4 / 4 * Math.PI
export const SW = 5 / 4 * Math.PI
export const S = 6 / 4 * Math.PI
export const SE = 7 / 4 * Math.PI
export const LEFT = 1
export const RIGHT = -1

export const CHAT = 'chat'
//client connect
export const CONNECT = 'connect'
//server connect
export const CONNECTION = 'connection'
//server and client socket disconnect
export const DISCONNECT = 'disconnect'
//message
export const MESSAGE_CLIENT_SEND = "message.client.sendd"
export const MESSAGE_SERVER_BROADCAST = "message.server.broadcast"

export interface ViewPort {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export const CLIENT_VIEWPORT = 'client.viewport'

export const CURRENT_PLAYER = 'current_player'

export const HOVERED_CHARACTER = 'client.character.hovered'

export const WORLD_OBJECTS = 'world.objects'
export const TEMPLATE_OBJECTS = 'world.templates'

export const ATTACK = 'attack'

//serverengine to clientengine
//clientengine to gameengine
export const CLIENT_CHARACTER_UPDATE = 'world.character.location.client'
//gameengine to serverengine
export const SERVER_CHARACTER_UPDATE = 'world.character.location.server'
//tell the server to create a character
export const CREATE_CHARACTER = 'world.character.create'
export const CREATE_OBJECT = 'world.object.create'

export const SPAWN_COMMUNITY = 'world.spawn_community'
//clientengine notify UI
//list of claimed characters, last selected character, last viewport
export const CLIENT_INFO = 'client.selected_characters.update'

//ASDW key inputs
export const TURN_LEFT = 'world.character.turn.left'
export const TURN_RIGHT = 'world.character.turn.right'
export const TURN_STOP = 'world.character.turn.stop'
export const DECELERATE = 'world.character.decelerate'
export const ACCELERATE = 'world.character.accelerate'
export const ACCELERATE_DOUBLE = 'world.character.accelerate_double'
export const STOP_ACCELERATE = 'world.character.stop_accelerate'
export const STOP_DOUBLE_ACCELERATE = 'world.character.stop_double_accelerate'
export const CAST_SPELL = 'world.character.cast_spell'
export const CLAIM_CHARACTER = 'world.character.claim'
export const UNCLAIM_CHARACTER = 'world.character.unclaim'
export const CONTROL_CHARACTER = 'world.character.control'
export const TARGET_CHARACTER = 'world.character.targeted'
export const GAME_EVENTS = 'game.events'
export const MOVE_TO = 'world.character.move_to'