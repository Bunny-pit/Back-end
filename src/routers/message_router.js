import express from 'express';
import MessageController from '../controllers/message_controller.js';
import FriendMessageController from '../controllers/friendMessage_controller.js';
const router = express.Router();

router.post('/', MessageController.createMessage);
router.post('/friend', FriendMessageController.createMessage);

export default router;
