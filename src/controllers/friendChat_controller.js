import FriendChatService from '../services/friendChat_service.js';

const FriendChatController = {
  async startChat(req, res) {
    try {
      const { userId } = req.body;
      const { anonymousUserId } = req.body;
      const newChat = await FriendChatService.startChat(
        userId,
        anonymousUserId,
      );
      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserChats(req, res) {
    try {
      const { userId } = req.params;
      const chats = await FriendChatService.getUserChats(userId);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getChatMessages(req, res) {
    try {
      const { chatId } = req.params;
      const messages = await FriendChatService.getChatMessages(chatId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteChat(req, res) {
    try {
      const { chatId } = req.params;
      const deletedChat = await FriendChatService.deleteChat(chatId);
      res.json({ message: '채팅을 삭제했습니다!', deletedChat });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default FriendChatController;
