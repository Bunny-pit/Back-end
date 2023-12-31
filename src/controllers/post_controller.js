import PostService from '../services/post_service.js';

const PostController = {
  async createPost(req, res) {
    try {
      const result = await PostService.createPost(req);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }

  },

  async getAllPosts(req, res) {
    try {
      const posts = await PostService.getAllPosts(req.oid);

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getUserPosts(req, res) {
    try {
      const {nickName} = req.params;
      const posts = await PostService.getUserPosts(nickName);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getPostById(req, res){
    const { postId } = req.params;

    try {
      const post = await PostService.getPostById(postId);
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  },
  async updatePost(req, res) {
    try {
      const { postId } = req.params;
      const updatedPost = await PostService.updatePost(postId, req.body, req.oid);

      if (!updatedPost) {
        return res.status(404).json({ error: '게시글을 찾지 못했습니다.' });
      }

      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletePost(req, res) {
    try {
      const { postId } = req.params;
      const deletedPost = await PostService.deletePost(postId, req.oid);

      if (!deletedPost) {
        return res.status(404).json({ error: '게시글을 찾지 못했습니다.' });
      }

      res.json({ message: '게시글을 성공적으로 삭제했습니다.', deletedPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default PostController;
