import mongoose from "mongoose";
import { Mainhome } from "../models/Mainhome";

const MainhomeService = {
  createPost: async data => {
    const newPost = new Mainhome(data);
    try {
      await newPost.save();
      return newPost;
    } catch (err) {
      throw err;
    }
  },

  getAllPosts: async () => {
    try {
      const posts = await Mainhome.find();
      return posts;
    } catch (err) {
      throw err;
    }
  },

  updatePost: async (postId, data) => {
    try {
      const updatedPost = await Mainhome.findByIdAndUpdate(postId, data, {
        new: true,
      });
      return updatedPost;
    } catch (err) {
      throw err;
    }
  },

  deletePost: async postId => {
    try {
      const deletedPost = await Mainhome.findByIdAndDelete(postId);
      return deletedPost;
    } catch (err) {
      throw err;
    }
  },
};

export default MainhomeService;
