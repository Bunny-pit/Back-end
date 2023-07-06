import MainhomeService from "../services/Mainhome_service.js";

const MainhomeController = {
  async createPost(req, res) {
    try {
      const newPost = await MainhomeService.createPost(req.body);

      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      const posts = await MainhomeService.getAllPosts();

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const updatedPost = await MainhomeService.updatePost(id, req.body);

      if (!updatedPost) {
        return res.status(404).json({ error: "게시글을 찾지 못했습니다." });
      }

      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const deletedPost = await MainhomeService.deletePost(id);

      if (!deletedPost) {
        return res.status(404).json({ error: "게시글을 찾지 못했습니다." });
      }

      res.json({ message: "게시글을 성공적으로 삭제했습니다.", deletedPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default MainhomeController;
