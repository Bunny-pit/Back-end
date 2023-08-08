import FriendMessage from '../database/models/friendMessage_model.js';

const FriendMessageService = {
  createMessage: async (senderId, chatId, content) => {
    try {
      const newMessage = new FriendMessage({
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

export default FriendMessageService;
