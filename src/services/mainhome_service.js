import Mainhome from "../database/models/mainhome_model.js";

const MainhomeService = {
  createMainhomePost: async data => {
    const newPost = new Mainhome(data);
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
      return posts;
    } catch (err) {
      throw err;
    }
  },

  updateMainhomePost: async (postId, data) => {
    try {
      const updatedPost = await Mainhome.findByIdAndUpdate(postId, data, {
        new: true,
      });
      return updatedPost;
    } catch (err) {
      throw err;
    }
  },

  deleteMainhomePost: async postId => {
    try {
      const deletedPost = await Mainhome.findByIdAndDelete(postId);
      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeService;
