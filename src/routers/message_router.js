import express from 'express';
import MessageController from '../controllers/message_controller.js';

const router = express.Router();

router.post('/', MessageController.createMessage);

export default router;
