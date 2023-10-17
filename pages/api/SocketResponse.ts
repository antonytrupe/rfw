import { Server, ServerOptions } from 'Socket.IO';

interface SocketOptions extends Partial<ServerOptions> {
  io: Server;
}
export interface SocketResponse {
  socket: {
    server: SocketOptions;
  };
  end: () => void;
}
