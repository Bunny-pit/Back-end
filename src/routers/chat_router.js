import express from 'express';
import ChatController from '../controllers/chat_controller.js';

const router = express.Router();

// 채팅 관련 API 라우팅
router.get('/chats/:userEmail', ChatController.getUserChats);
router.get('/chats/:chatId/messages', ChatController.getChatMessages);
router.delete('/chats/:chatId', ChatController.deleteChat);

export default router;
