import {Post} from '../database/models/index.js'
import Like from '../database/models/like_model.js'
import LikeService from '../services/like_service.js'
import { upload,uploadToS3, s3 } from '../config/s3.js';
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
      const newLike = new Like({
        postId: savedPost._id, // this connects the Like to the Post
        userId: [], // initialize 'userId' field as an empty array
      });
      await newLike.save(); // save the new Like
  
      return { success: true, message: savedPost };
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
        const like = await LikeService.getLike(postId);
        
        console.log(like)
        // const countLength = like.userId.length;
        return {post : post, like : like};
      } catch (err) {
        throw  err;
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
        const post = await Post.findById(postId);
  
        // S3에서 각 이미지 삭제
        for(let i = 0; i < post.images.length; i++) {
          const url = post.images[i];
          const Key = url.split('amazonaws.com/')[1];
  
          var params = {
            Bucket: process.env.S3_BUCKET_NAME, 
            Key
          };
          
          s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // error occurred
            else     console.log(data);           // successful response
          });
        }
  
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