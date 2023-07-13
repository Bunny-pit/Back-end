import Message from '../database/models/message_model.js';

const MessageService = {
  createMessage: async (senderId, chatId, content) => {
    try {
      const newMessage = new Message({
        sender: senderId,
        chat: chatId,
        content: content,
      });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw error;
    }
  },
};

export default MessageService;
