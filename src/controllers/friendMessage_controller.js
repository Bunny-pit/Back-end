import FriendMessageService from '../services/friendMessage_service.js';
import { getSocketIo } from '../lib/socket.js';

const FriendMessageController = {
  async createMessage(req, res) {
    try {
      const { senderId, chatId, content } = req.body;
      const newMessage = await FriendMessageService.createMessageAndEmit(
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

export default FriendMessageController;
