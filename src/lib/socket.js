import { Server } from 'socket.io';

let io;

export const initializeSocketIo = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'https://web-front-end-kvmh2mljxnw03c.sel4.cloudtype.app',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });
  return io;
};

export const getSocketIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
