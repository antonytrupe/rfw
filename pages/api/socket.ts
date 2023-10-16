import { Server, ServerOptions } from 'Socket.IO'
import { JsonDB, Config } from 'node-json-db';

interface SocketOptions extends Partial<ServerOptions> {
  io: Server
}

interface SocketResponse {
  socket: {
    server: SocketOptions;
  };
  end: () => void;
}

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new JsonDB(new Config("myDataBase", true, true, '/'));
db.load()
//db.save()
//console.log('opened/created db')

const SocketHandler = (req: any, res: SocketResponse) => {
  if (res.socket.server?.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    //@ts-ignore
    res.socket.server.io = io

    

    io.on('connection', socket => {

      socket.on('input-change', async msg => {
        console.log('msg',msg)
        //save the message
        await db.push("/msg1",msg);

        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler