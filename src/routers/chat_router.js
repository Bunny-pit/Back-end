import express from 'express';
import ChatController from '../controllers/chat_controller.js';
import loginRequired from '../middlewares/login_required.js';

const router = express.Router();

// 채팅 관련 API 라우팅
router.post('/start', loginRequired, ChatController.startChat);
router.get('/:userEmail', ChatController.getUserChats);
router.get('/:chatId/messages', ChatController.getChatMessages);
router.delete('/:chatId', ChatController.deleteChat);

export default router;
