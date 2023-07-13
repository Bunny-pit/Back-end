import Chat from '../database/models/chat_model.js';
import Message from '../database/models/message_model.js';

const ChatService = {
  getUserChats: async (userEmail) => {
    try {
      const chats = await Chat.find({ 'users.email': userEmail }).populate(
        'users',
      );
      return chats;
    } catch (error) {
      throw error;
    }
  },

  getChatMessages: async (chatId) => {
    try {
      const messages = await Message.find({ chat: chatId }).populate(
        'sender',
        'email',
      );
      return messages;
    } catch (error) {
      throw error;
    }
  },

  deleteChat: async (chatId) => {
    try {
      const deletedChat = await Chat.findByIdAndDelete(chatId);
      return deletedChat;
    } catch (error) {
      throw error;
    }
  },
  createMessage: async (senderId, chatId, content) => {
    try {
      const newMessage = new Message({
        sender: senderId,
        chat: chatId,
        content: content,
      });
      await newMessage.save();
      // Update chat's lastMessage
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { lastMessage: newMessage._id },
        { new: true },
      );
      return chat;
    } catch (error) {
      throw error;
    }
  },
};

export default ChatService;
