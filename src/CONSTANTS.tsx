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
export const CHARACTER_PATH = '/CHARACTER'

//tell the client the current location and vector of a character
export const CLIENT_CHARACTER_UPDATE = 'world.character.location.client'
export const SERVER_CHARACTER_UPDATE = 'world.character.location.server'
export const PC_DISCONNECT = 'world.character.disconnect'
export const PC_JOIN = 'world.character.join'
//tell the server to create a character
export const CREATE_CHARACTER = 'world.character.create'
//tell the client which character it is controlling
export const PC_CURRENT = 'world.character.current'
export const WORLD_UPDATE = 'world.update'
export const CLIENT_UPDATE = 'client.selected_characters.update'

//ASDW key inputs
export const TURN_LEFT = 'world.character.turn.left'
export const TURN_RIGHT = 'world.character.turn.right'
export const TURN_STOP = 'world.character.turn.stop'
export const DECELERATE = 'world.character.decelerate'
export const ACCELERATE = 'world.character.accelerate'
export const DECELERATE_DOUBLE = 'world.character.decelerate_double'
export const ACCELERATE_DOUBLE = 'world.character.accelerate_double'
export const STOP_ACCELERATE = 'world.character.stop_accelerate'
export const STOP_DOUBLE_ACCELERATE = 'world.character.stop_double_accelerate'
