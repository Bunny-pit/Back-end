import express from 'express';
import ChatController from '../controllers/chat_controller.js';
import FriendChatController from '../controllers/friendChat_controller.js';
import loginRequired from '../middlewares/login_required.js';
const router = express.Router();

// 채팅 관련 API 라우팅
router.post('/start', loginRequired, ChatController.startChat);
router.post('/friend/start', loginRequired, FriendChatController.startChat);
router.get('/:userId', loginRequired, ChatController.getUserChats);
router.get('/friend/:userId', loginRequired, FriendChatController.getUserChats);
router.get('/:chatId/messages', loginRequired, ChatController.getChatMessages);
router.get(
  '/:chatId/friend/messages',
  loginRequired,
  FriendChatController.getChatMessages,
);
router.delete('/:chatId', loginRequired, ChatController.deleteChat);
router.delete(
  '/friend/:chatId',
  loginRequired,
  FriendChatController.deleteChat,
);

export default router;
