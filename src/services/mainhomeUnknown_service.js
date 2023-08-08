import MainhomeUnknown from '../database/models/mainhomeUnknown_model.js';
import User from '../database/models/user_model.js';

const MainhomeUnknownService = {
  createMainhomePost: async (oid, data) => {
    try {
      const user = await User.findById(oid);

      if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
      }

      const newPost = new MainhomeUnknown({
        ...data,
        userId: oid,
        email: user.email,
        name: user.secretName,
      });

      await newPost.save();
      return newPost;
    } catch (err) {
      throw err;
    }
  },

  getAllMainhomePosts: async (page, limit) => {
    try {
      const posts = await MainhomeUnknown.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return posts.map(post => ({
        ...post._doc,
        email: post.email,
      }));
    } catch (err) {
      throw err;
    }
  },

  updateMainhomePost: async (oid, postId, data) => {
    try {
      const post = await MainhomeUnknown.findById(postId);
      if (!post) {
        throw new Error('게시글을 찾지 못했습니다.');
      } else if (post.userId.toString() !== oid.toString()) {
        throw new Error('게시글 수정 권한이 없습니다.');
      }

      const updatedPost = await MainhomeUnknown.findByIdAndUpdate(
        postId,
        {
          ...data,
          email: post.email,
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

  deleteMainhomePost: async (oid, postId) => {
    try {
      const post = await MainhomeUnknown.findById(postId);
      if (!post) {
        throw new Error('게시글을 찾지 못했습니다.');
      } else if (post.userId.toString() !== oid.toString()) {
        throw new Error('게시글 삭제 권한이 없습니다.');
      }

      const deletedPost = await MainhomeUnknown.findByIdAndDelete(postId);

      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeUnknownService;
