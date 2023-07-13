import express from 'express';
import MessageController from '../controllers/message_controller.js';

const router = express.Router();

router.post('/messages', MessageController.createMessage);

export default router;
