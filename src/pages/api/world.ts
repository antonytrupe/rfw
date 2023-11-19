import { Server } from 'socket.io'
import { SocketResponse } from '@/SocketResponse'
import { NextRequest } from 'next/server'
import ServerEngine from '@/ServerEngine'
 
export default function handler(req: NextRequest, res: SocketResponse) {
  if (res.socket.server?.io) {
    //console.log('Socket is already running')
    //console.log(2, ++one)

  } else {
    //console.log(3, ++one)
    const io = new Server(res.socket.server, {
      path: "/api/world/"
    })
    res.socket.server.io = io
    //serverEngine =
    new ServerEngine(io)
  }
  res.end()
}