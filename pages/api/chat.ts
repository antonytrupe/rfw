import { Server, Socket } from 'Socket.IO'
import { JsonDB, Config } from 'node-json-db';
import { SocketResponse } from './SocketResponse';
import { MESSAGE_CLIENT_SEND, MESSAGE_SERVER_BROADCAST } from '@/CONSTANTS';
 
 

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new JsonDB(new Config("myDataBase", true, true, '/'));
db.load()
//db.save()
//console.log('opened/created db')

const ChatHandler = (req: any, res: SocketResponse) => {
  if (res.socket.server?.io) {
    console.log('chat socket already running')
  } else {
    console.log('chat socket initializing')
    const io = new Server(res.socket.server)
    //@ts-ignore
    res.socket.server.io = io 

    io.on('connection', (socket:Socket) => {
      console.log('chat socket connected')
      console.log('chat socket.id', socket.id)

      socket.on(MESSAGE_CLIENT_SEND, async (msg:string) => {
        console.log('chat socket got message',msg)
        //save the message
        await db.push("/msg1",msg);

        socket.broadcast.emit(MESSAGE_SERVER_BROADCAST, msg)
      })
    })
  }
  res.end()
}

export default ChatHandler