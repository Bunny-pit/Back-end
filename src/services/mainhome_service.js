import Mainhome from '../database/models/mainhome_model.js';
import md5 from 'md5';

const MainhomeService = {
  createMainhomePost: async (user, data) => {
    const newPost = new Mainhome({
      ...data,
      email: user.email,
      name: user.userName,
    });
    try {
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
        email: md5(post.email.trim().toLowerCase()),
      }));
    } catch (err) {
      throw err;
    }
  },

  updateMainhomePost: async (user, postId, data) => {
    try {
      const post = await Mainhome.findById(postId);

      if (post.email !== user.email) {
        throw new Error('권한이 없습니다.');
      }

      const updatedPost = await Mainhome.findByIdAndUpdate(
        postId,
        { ...data },
        { new: true },
      );

      return updatedPost;
    } catch (err) {
      throw err;
    }
  },

  deleteMainhomePost: async (user, postId) => {
    try {
      const post = await Mainhome.findById(postId);

      if (post.email !== user.email) {
        throw new Error('권한이 없습니다.');
      }

      const deletedPost = await Mainhome.findByIdAndDelete(postId);
      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeService;
