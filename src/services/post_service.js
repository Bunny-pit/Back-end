import { Post, User } from '../database/models/index.js';
import Like from '../database/models/like_model.js';
import LikeService from '../services/like_service.js';
import { uploadToS3, deleteFromS3 } from '../config/s3.js';
import mongoose from 'mongoose';

const PostService = {
  createPost: async req => {
    try {
      const { content } = req.body;
      const user = await User.findById({ _id: req.oid });
      const userId = user._id;
      const userName = user.userName;
      let uploadedImages = await Promise.all(
        req.files.map(async file => {
          let uploadResult = await uploadToS3(file);
          if (uploadResult.success) {
            return uploadResult.url;
          }
        }),
      );

      const newPost = new Post({
        userId: new mongoose.Types.ObjectId(userId),
        userName: userName,
        content: content,
        images: uploadedImages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      let savedPost = await newPost.save();

      const newLike = new Like({
        postId: savedPost._id,
        userId: [],
      });
      await newLike.save();

      return { success: true, message: savedPost };
    } catch (err) {
      throw err;
    }
  },

  getAllPosts: async oid => {
    try {
      const user = await User.findById({ _id: oid });
      const userName = user.userName;
      const posts = await Post.find({ userId: oid }).sort({ createdAt: -1 });
      return { posts: posts, userName: userName };
    } catch (err) {
      throw err;
    }
  },

  getPostById: async postId => {
    try {
      const post = await Post.findById(postId).populate('userName');
      const user = await User.findOne({ userName: post.userName });
      const like = await LikeService.getLike(postId);
      // const countLength = like.userId.length;
      return { post: post, like: like, user: user };
    } catch (err) {
      throw err;
    }
  },
  getUserPosts: async userName => {
    try {
      const user = await User.find({ userName: userName });
      const posts = await Post.find({ userName }).sort({ createdAt: -1 });
      return { posts: posts, userName: userName, user: user };
    } catch (err) {
      throw err;
    }
  },
  updatePost: async (postId, newPostData, userId) => {
    try {
      const post = await Post.findById(postId);
      if (post.userId == userId) {
        const updatedPost = await Post.findByIdAndUpdate(postId, newPostData, {
          new: true,
        });
        return updatedPost;
      } else {
        console.log('userId가 일치하지 않습니다!');
      }
    } catch (err) {
      throw err;
    }
  },

  deletePost: async (postId, userId) => {
    try {
      const post = await Post.findById(postId);
      if (post.userId == userId) {
        // S3에서 각 이미지 삭제
        for (let i = 0; i < post.images.length; i++) {
          const url = post.images[i];
          const Key = url.split('amazonaws.com/')[1];

          // 기존 s3.deleteObject 방식 대신 deleteFromS3 함수를 사용합니다.
          await deleteFromS3(Key);
        }

        await Like.deleteOne({ postId: postId });

        const deletedPost = await Post.findByIdAndDelete(postId);
        return deletedPost;
      } else {
        console.log('userId가 일치하지 않습니다!');
      }
    } catch (err) {
      throw err;
    }
  },
};

export default PostService;
