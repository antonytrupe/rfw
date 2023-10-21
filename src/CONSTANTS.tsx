//"use client";

//client connect
export const CONNECT = 'connect'
//server connect
export const CONNECTION = 'connection'
//server and client socket disconnect
export const DISCONNECT = 'disconnect'
//message
export const MESSAGE_CLIENT_SEND = "message.client.send"
export const MESSAGE_SERVER_BROADCAST = "message.server.broadcast"

//tell the client the current location and vector of a character
export const CHARACTER_LOCATION = 'world.character.location'
export const PC_DISCONNECT = 'world.character.disconnect'
export const PC_JOIN = 'world.character.join'
//tell the server to create a character
export const CREATE_CHARACTER = 'world.character.create'
//tell the client which character it is controlling
export const PC_CURRENT = 'world.character.current'

//ASDW key inputs
export const TURN_LEFT = 'world.character.turn.left'
export const TURN_RIGHT = 'world.character.turn.right'
export const DECELERATE = 'world.character.decelerate'
export const ACCELERATE = 'world.pc.accelerate'

