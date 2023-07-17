import MessageService from '../services/message_service.js';
import { getSocketIo } from '../lib/socket.js';

const MessageController = {
  async createMessage(req, res) {
    try {
      const { senderId, chatId, content } = req.body;
      const newMessage = await MessageService.createMessageAndEmit(
        senderId,
        chatId,
        content,
      );
      const io = getSocketIo();
      io.to(chatId).emit('newMessage', newMessage);

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default MessageController;
