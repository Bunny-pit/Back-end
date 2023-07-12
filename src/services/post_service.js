import {Post} from '../database/models/index.js'

const PostService = {
    createPost: async (content, file) => {
      try {
        const newPost = new Post({
          content,
          image: file.path,
        });
        await newPost.save();
        return newPost;
      } catch (err) {
        throw new err;
      }
    },
    getAllPosts: async () => {
        try {
            const posts = await Post.find();
            return posts;
        } catch (err) {
            throw err;
        }
    },
    getPostById: async (postId) => {
      try {
        const post = await Post.findById(postId);
        return post;
      } catch (err) {
        throw new err;
      }
    },
    updatePost: async (postId, newPostData) => {
        try {
            const updatedPost = await Post.findByIdAndUpdate(postId, newPostData, {
                new: true,
            });
            return updatedPost;
        } catch (err) {
            throw err;
        }
    },

    deletePost: async (postId) => {
        try {
            const deletedPost = await Post.findByIdAndDelete(postId);
            return deletedPost;
        } catch (err) {
            throw err;
        }
    },
};

export default PostService;