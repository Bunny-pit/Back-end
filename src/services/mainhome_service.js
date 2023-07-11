import mainhome from "../database/models/mainhome_model.js";

const mainhomeService = {
  createMainhomePost: async data => {
    const newPost = new mainhome(data);
    try {
      await newPost.save();
      return newPost;
    } catch (err) {
      throw err;
    }
  },

  getAllMainhomePosts: async () => {
    try {
      const posts = await mainhome.find();
      return posts;
    } catch (err) {
      throw err;
    }
  },

  updateMainhomePost: async (postId, data) => {
    try {
      const updatedPost = await mainhome.findByIdAndUpdate(postId, data, {
        new: true,
      });
      return updatedPost;
    } catch (err) {
      throw err;
    }
  },

  deleteMainhomePost: async postId => {
    try {
      const deletedPost = await mainhome.findByIdAndDelete(postId);
      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default mainhomeService;
