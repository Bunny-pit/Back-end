import {Post} from '../database/models/index.js'
import { upload,uploadToS3 } from "../config/s3.js";
import mongoose from 'mongoose';

const PostService = {
  createPost: async (req) => {
    try {
      const { userId, content } = req.body;
      let uploadedImages = await Promise.all(req.files.map(async (file) => {
        let uploadResult = await uploadToS3(file);
        if(uploadResult.success) {
          return uploadResult.url;
        }
      }));
      const newPost = new Post({
        userId:  new mongoose.Types.ObjectId(userId),
        content: content,
        images: uploadedImages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      let savedPost = await newPost.save();
      return { success: true, message:savedPost };
    } catch (err) {
      throw err;
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
function generateRandomFileName() {
  const randomBytes = crypto.randomBytes(8);
  const fileName = randomBytes.toString('hex') + '.png';
  return fileName;
}

export default PostService;