import { Server } from 'Socket.IO'
import { JsonDB, Config } from 'node-json-db';
import { SocketResponse } from '../../src/SocketResponse';
import { CONNECTION,CREATE_CHARACTER, DISCONNECT, PC_CURRENT, PC_DISCONNECT, CHARACTER_LOCATION } from '@/CONSTANTS';
import { Player as Character } from '../../app/worldSlice';
import { NextRequest } from 'next/server';

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new JsonDB(new Config("world", true, true, '/'));
db.load()
//db.save()
//console.log('opened/created db')

export default function (req: NextRequest, res: SocketResponse) {
  if (res.socket.server?.io) {
    console.log('Socket is already running')
    //let p: Player = await db.getData('/pc/' + msg.playerId)
    res.socket.server?.io.on(CONNECTION, socket => {
      //console.log('wat', socket.id)
    })

  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    //@ts-ignore
    res.socket.server.io = io


    res.socket.server.io.on(CONNECTION, socket => {
      console.log(CONNECTION, socket.id)

      socket.on(CREATE_CHARACTER, () => {
        console.log('world',CREATE_CHARACTER)
        let x = Math.random() * 400
        let y = Math.random() * 400
        let p: Character = { id: socket.id, location: { x: x, y: y }, vector: { angle: 0, velocity: 0 } }
        console.log(p)
        //save the new pc
        db.push('/pc/' + socket.id, p)
        //tell everyone about the new character
        socket.broadcast.emit(PC_CURRENT, p)
        socket.emit(PC_CURRENT, p)

      })

      socket.on(DISCONNECT, (reason) => {
        // ...
        console.log(DISCONNECT, socket.id)
        //remove the character from the database
        db.delete('/pc/' + socket.id)
        //broadcast the removal
        socket.broadcast.emit(PC_DISCONNECT, socket.id)
      });

      socket.on(CHARACTER_LOCATION, async (msg: { playerId: string, direction: { x: number, y: number } }) => {
        console.log(CHARACTER_LOCATION, msg)
        //console.log(socket.id)
        //get the player
        let p: Character
        try {
          p = await db.getData('/pc/' + msg.playerId)
          console.log(1, p)
          p.location.x += msg.direction.x
          p.location.y += msg.direction.y
          console.log(2, p)

          //save the player
          db.push('/pc/' + msg.playerId, p);
          //broadcast the player
          socket.broadcast.emit(CHARACTER_LOCATION, p)
        }
        catch (error) {
          console.error('error looking up pc to move', error);
        }
      })

      //tell the client where all the other players are
      db.getObject<string>('/pc/').then((allPlayers: string) => {
        //console.log('string', allPlayers)
        Object.entries(allPlayers).forEach(([id, player]) => {
          //console.log('id', id)
          //console.log('player', player)
          socket.emit(CHARACTER_LOCATION, player)

        })
      })
    })
  }
  res.end()
}