import Chat from '../database/models/chat_model.js';
import Message from '../database/models/message_model.js';
import mongoose from 'mongoose';
import { getSocketIo } from '../lib/socket.js';

const ChatService = {
  startChat: async (userId, anonymousUserId) => {
    try {
      const newChat = new Chat({
        users: [
          new mongoose.Types.ObjectId(userId),
          new mongoose.Types.ObjectId(anonymousUserId),
        ],
      });

      await newChat.validate();

      await newChat.populate('users');
      await newChat.save();
      return newChat;
    } catch (error) {
      throw error;
    }
  },

  getUserChats: async (userId) => {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const chats = await Chat.find({ 'users.0': objectId }).populate(
        'users',
        'userName email',
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
        chat: chatId,
        sender: senderId,
        content,
      });

      await newMessage.save();

      return newMessage;
    } catch (error) {
      throw error;
    }
  },
  createMessageAndEmit: async (senderId, chatId, content) => {
    const newMessage = await ChatService.createMessage(
      senderId,
      chatId,
      content,
    );
    console.log(content);

    return newMessage;
  },
};

export default ChatService;
