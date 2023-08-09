import FriendChat from '../database/models/friendChat_model.js';
import FriendMessage from '../database/models/friendMessage_model.js';
import mongoose from 'mongoose';
import { getSocketIo } from '../lib/socket.js';
import User from '../database/models/user_model.js';

const FriendChatService = {
  startChat: async (userId, anonymousUserId) => {
    try {
      const user = await User.findById(userId);
      const anonymousUser = await User.findById(anonymousUserId);

      const newChat = new FriendChat({
        users: [
          new mongoose.Types.ObjectId(userId),
          new mongoose.Types.ObjectId(anonymousUserId),
        ],

        name: user.secretName,
        anonymousName: anonymousUser.secretName,
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
      const chats = await FriendChat.find({
        users: { $in: [objectId] },
      }).populate('users', 'userName secretName email');
      return chats;
    } catch (error) {
      throw error;
    }
  },

  getChatMessages: async (chatId) => {
    try {
      const messages = await FriendMessage.find({ chat: chatId }).populate(
        'sender',
        'email secretName',
      );
      return messages;
    } catch (error) {
      throw error;
    }
  },

  deleteChat: async (chatId) => {
    try {
      await FriendMessage.deleteMany({ chat: chatId });
      const deletedChat = await FriendChat.findByIdAndDelete(chatId);
      return deletedChat;
    } catch (error) {
      throw error;
    }
  },
  createMessage: async (senderId, chatId, content) => {
    try {
      const newMessage = new FriendMessage({
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
    const newMessage = await FriendChatService.createMessage(
      senderId,
      chatId,
      content,
    );
    const populatedMessage = await FriendMessage.findById(
      newMessage._id,
    ).populate('sender', 'email secretName');
    console.log('friendchat', content);

    return populatedMessage;
  },
};

export default FriendChatService;
