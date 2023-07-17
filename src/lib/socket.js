import { Server } from 'socket.io';

let io;

export const initializeSocketIo = (server) => {
  io = new Server(server);
  return io;
};

export const getSocketIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};