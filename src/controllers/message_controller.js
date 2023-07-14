import MessageService from '../services/message_service.js';

const MessageController = {
  async createMessage(req, res) {
    try {
      const { senderId, chatId, content } = req.body;
      const newMessage = await MessageService.createMessage(
        senderId,
        chatId,
        content,
      );
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default MessageController;
