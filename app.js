import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import FriendChatService from './src/services/friendChat_service.js';
import ChatService from './src/services/chat_service.js';
import http from 'http';
import logger from 'winston';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { initializeSocketIo } from './src/lib/socket.js';

const app = express();
const server = http.createServer(app);
const io = initializeSocketIo(server);

//환경 설정
dotenv.config();

const port = process.env.PORT || 3001;

const allowedOrigins = process.env.ORIGIN
  ? process.env.ORIGIN.split(',')
  : ['http://localhost:3000'];

console.log('allowedOrigins', allowedOrigins);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routesPath = path.join(__dirname, 'src', 'routers');
const files = fs.readdirSync(routesPath);

//express 탑재 body-parser 사용, cors 설정
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('SUCCESS');
        callback(null, true);
      } else {
        callback(
          new Error(
            `cors list ${allowedOrigins.join(', ')}, your origin is ${origin}`,
          ),
        );
      }
    },
    credentials: true,
  }),
);

// route
app.get('/', (req, res) => {
  res.send('여기는 버니톡의 백엔드 페이지입니다!');
});

const startServer = async () => {
  // 모든 라우터 코드를 동적으로 불러오도록 설정
  await Promise.all(
    files.map(async file => {
      if (file.endsWith('.js')) {
        const route = await import(path.join('file://', routesPath, file));
        const apiEndpoint = '/api/' + file.replace('_router.js', '');
        app.use(apiEndpoint, route.default);
      }
    }),
  );

  server.listen(port, () => {
    logger.info(`서버가 http://localhost:${port}에 성공적으로 연결되었습니다.`);
    mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => logger.info('몽고디비 연결에 성공했습니다.'))
      .catch(e => console.error(e));
  });

  io.on('connection', socket => {
    console.log('User connected: ' + socket.id);

    socket.on('joinRoom', ({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`User ${userId} joined the room ${chatId}`);
    });

    socket.on('chatMessage', async ({ senderId, chatId, content }) => {
      const newMessage = await ChatService.createMessageAndEmit(
        senderId,
        chatId,
        content,
      );
      io.to(chatId).emit('newMessage', newMessage);
    });
    socket.on('friendchatMessage', async ({ senderId, chatId, content }) => {
      const newMessage = await FriendChatService.createMessageAndEmit(
        senderId,
        chatId,
        content,
      );
      io.to(chatId).emit('newMessage', newMessage);
    });

    socket.on('leaveRoom', ({ chatId, userId }) => {
      socket.leave(chatId);
      console.log(`User ${userId} left room ${chatId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });
};

startServer();
