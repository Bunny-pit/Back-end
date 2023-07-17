import Mainhome from '../database/models/mainhome_model.js';
import User from '../database/models/user_model.js';
import md5 from 'md5';

const MainhomeService = {
  createMainhomePost: async (email, data) => {
    try {
      // User model에서 email을 통해 사용자 이름을 가져옵니다.
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('User not found');
      }
      const newPost = new Mainhome({
        ...data,
        email: email,
        name: user.sercretName,
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
        email: post.email ? md5(post.email.trim().toLowerCase()) : undefined,
      }));
    } catch (err) {
      throw err;
    }
  },

  updateMainhomePost: async (email, postId, data) => {
    try {
      const updatedPost = await Mainhome.findByIdAndUpdate(
        postId,
        {
          ...data,
          email: email ? md5(email.trim().toLowerCase()) : undefined,
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
      const deletedPost = await Mainhome.findByIdAndDelete({
        _id: postId,
        email: email,
      });

      if (!deletedPost) {
        throw new Error('게시물을 찾을 수 없습니다.');
      }

      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeService;
