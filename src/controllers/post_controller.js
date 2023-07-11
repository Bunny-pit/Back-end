import PostService from "../Services/post_service.js";

const PostController = {
  async createPost(req, res) {
    try {
      const newPost = await PostService.createPost(req.body);

      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      const posts = await PostService.getAllPosts();

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updatePost(req, res) {
    try {
      const { postId } = req.params;
      const updatedPost = await PostService.updatePost(
        postId,
        req.body,
      );

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
      const { postId } = req.params;
      const deletedPost = await PostService.deletePost(postId);

      if (!deletedPost) {
        return res.status(404).json({ error: "게시글을 찾지 못했습니다." });
      }

      res.json({ message: "게시글을 성공적으로 삭제했습니다.", deletedPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default PostController;
