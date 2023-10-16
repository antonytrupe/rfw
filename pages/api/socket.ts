import { Server, ServerOptions } from 'Socket.IO'

interface SocketOptions extends Partial<ServerOptions> {
  io: Server
}

interface SocketResponse {
  socket: {
    server: SocketOptions | undefined;
  };
  end: () => void;
}

const SocketHandler = (req: any, res: SocketResponse) => {
  //@ts-ignore
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
     //@ts-ignore
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('input-change', msg => {
        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler