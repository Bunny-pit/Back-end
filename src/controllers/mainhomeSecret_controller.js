import MainhomeSecretService from '../services/mainhomeSecret_service.js';

const mainhomeSecretController = {
  async createMainhomePost(req, res) {
    try {
      const newPost = await MainhomeSecretService.createMainhomePost(
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
      const posts = await MainhomeSecretService.getAllMainhomePosts(
        page,
        limit,
      );

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async updateMainhomePost(req, res) {
    try {
      const { id } = req.params;

      const updatedPost = await MainhomeSecretService.updateMainhomePost(
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

      const deletedPost = await MainhomeSecretService.deleteMainhomePost(
        req.oid,
        id,
      );

      if (!deletedPost) {
        return res.status(404).json({ error: '게시글을 찾지 못했습니다.' });
      }

      res.json({ message: '게시글을 성공적으로 삭제했습니다.', deletedPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async reportPost(req, res) {
    try {
      const { id: postId } = req.params;
      const { reason } = req.body;

      const post = await MainhomeSecretService.reportPost(
        req.oid,
        postId,
        reason,
      );

      res.json({ message: '게시글을 성공적으로 신고했습니다.', post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getReportPosts(req, res) {
    try {
      const reportedPosts = await MainhomeSecretService.getReportedPosts();

      if (!reportedPosts.length) {
        return res
          .status(404)
          .json({ message: '신고 3회 이상 누적된 게시글이 없습니다.' });
      }

      res.json(reportedPosts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default mainhomeSecretController;
