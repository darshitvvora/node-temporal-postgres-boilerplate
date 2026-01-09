/**
 * Socket.io configuration
 */

import type { Server as SocketIOServer, Socket } from 'socket.io';

interface ExtendedSocket extends Socket {
  address?: string;
  connectedAt?: Date;
  log?: (...data: unknown[]) => void;
}

// When the user disconnects.. perform this
function onDisconnect(_socket?: ExtendedSocket): void {}

// When the user connects.. perform this
function onConnect(socket: ExtendedSocket): void {
  // When the client emits 'info', this listens and executes
  socket.on('info', (data: unknown) => {
    socket.log?.(JSON.stringify(data, null, 1));
  });

  // Insert sockets below
  // require('../api/thing/thing.socket').register(socket);
}

export default function SocketTest(socketio: SocketIOServer): void {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output,
  // set DEBUG (in server/config/local.env.js)
  // to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and
  // access their token through socket.decoded_token
  //
  // 1. You will need to send the
  // token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', (socket: Socket) => {
    const extendedSocket = socket as ExtendedSocket;

    Object.assign(extendedSocket, {
      address: `${socket.request.connection?.remoteAddress}
      :${socket.request.connection?.remotePort}`,
      connectedAt: new Date(),
      log: (...data: unknown[]) => {
        console.log(`SocketIO ${socket.nsp.name} [${extendedSocket.address}]`, ...data);
      },
    });

    // Call onDisconnect.
    extendedSocket.on('disconnect', () => {
      onDisconnect(extendedSocket);
      extendedSocket.log?.('DISCONNECTED');
    });

    // Call onConnect.
    onConnect(extendedSocket);
    extendedSocket.log?.('CONNECTED');
  });
}
