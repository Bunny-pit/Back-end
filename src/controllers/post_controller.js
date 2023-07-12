import PostService from "../services/post_service.js";

const PostController = {
  async createPost(req, res) {
    // try {
    //   const { userId, content } = req.body;
    //   const { files } = req;
    //   console.log("userId = ",userId,"content = ", content,"files=", files)

    //   const newPost = await PostService.createPost(userId, content, files);
    //   res.status(201).json(newPost);
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
    try {
      const result = await PostService.createPost(req);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
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
      const updatedPost = await PostService.updatePost(postId, req.body);

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
