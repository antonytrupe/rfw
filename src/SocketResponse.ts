import { Server, ServerOptions } from 'Socket.IO';
import { NextResponse } from 'next/server';

interface SocketOptions extends Partial<ServerOptions> {
  io: Server;
}
export interface SocketResponse extends NextResponse {
  socket: {
    server: SocketOptions;
  };
  end: () => void;
}
