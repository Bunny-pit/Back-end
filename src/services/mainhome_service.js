import Mainhome from '../database/models/mainhome_model.js';
import User from '../database/models/user_model.js';

const MainhomeService = {
  createMainhomePost: async (email, data) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
      }
      const newPost = new Mainhome({
        ...data,
        email: email,
        name: user.secretName,
      });
      await newPost.save();
      return newPost;
    } catch (err) {
      throw err;
    }
  },
  getAllMainhomePosts: async () => {
    try {
      const posts = await Mainhome.find().sort({ createdAt: -1 });
      return posts.map(post => ({
        ...post._doc,
        email: post.email,
      }));
    } catch (err) {
      throw err;
    }
  },

  updateMainhomePost: async (email, postId, data) => {
    try {
      const post = await Mainhome.findById(postId);
      if (!post) {
        throw new Error('게시글을 찾지 못했습니다.');
      } else if (post.email !== email) {
        throw new Error('게시글 수정 권한이 없습니다.');
      }

      const updatedPost = await Mainhome.findByIdAndUpdate(
        postId,
        {
          ...data,
          email: email,
        },
        {
          new: true,
        },
      );

      return updatedPost;
    } catch (err) {
      throw err;
    }
  },

  deleteMainhomePost: async (email, postId) => {
    try {
      const post = await Mainhome.findById(postId);
      if (!post) {
        throw new Error('게시글을 찾지 못했습니다.');
      } else if (post.email !== email) {
        throw new Error('게시글 삭제 권한이 없습니다.');
      }

      const deletedPost = await Mainhome.findByIdAndDelete(postId);

      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeService;
