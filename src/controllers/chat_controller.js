import ChatService from '../services/chat_service.js';

const ChatController = {
  async startChat(req, res) {
    try {
      const { userId } = req;
      const { anonymousUserId } = req.body;
      const newChat = await ChatService.startChat(userId, anonymousUserId);
      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserChats(req, res) {
    try {
      const { userEmail } = req.params;
      const chats = await ChatService.getUserChats(userEmail);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getChatMessages(req, res) {
    try {
      const { chatId } = req.params;
      const messages = await ChatService.getChatMessages(chatId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteChat(req, res) {
    try {
      const { chatId } = req.params;
      const deletedChat = await ChatService.deleteChat(chatId);
      res.json({ message: '채팅을 삭제했습니다.', deletedChat });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default ChatController;
