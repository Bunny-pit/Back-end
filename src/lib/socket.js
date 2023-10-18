import { Server } from 'socket.io';

let io;

export const initializeSocketIo = server => {
  const origins = (process.env.ORIGIN || 'http://localhost:3000').split(',');

  io = new Server(server, {
    cors: {
      origin: origins,
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
