import MainhomeService from '../services/mainhome_service.js';

const mainhomeController = {
  async createMainhomePost(req, res) {
    try {
      const newPost = await MainhomeService.createMainhomePost(
        req.oid,
        req.body,
      );

      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllMainhomePosts(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const posts = await MainhomeService.getAllMainhomePosts(page, limit);

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async updateMainhomePost(req, res) {
    try {
      const { id } = req.params;

      const updatedPost = await MainhomeService.updateMainhomePost(
        req.oid,

        id,
        req.body,
      );

      if (!updatedPost) {
        return res.status(404).json({ error: '게시글을 찾지 못했습니다.' });
      }

      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteMainhomePost(req, res) {
    try {
      const { id } = req.params;

      const deletedPost = await MainhomeService.deleteMainhomePost(req.oid, id);

      if (!deletedPost) {
        return res.status(404).json({ error: '게시글을 찾지 못했습니다.' });
      }

      res.json({ message: '게시글을 성공적으로 삭제했습니다.', deletedPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default mainhomeController;
