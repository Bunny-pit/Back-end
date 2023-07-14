import Comment from '../database/models/comment_model.js'
import mongoose from 'mongoose';

const CommentService = {
  createComment: async (comment, postId, userId,userName) => {
    try {
      const newComment = new Comment({ comment, postId, userId,userName});
      return newComment.save();
    } catch (err) {
      throw err;
    }
  },

    getAllComments: async () => {
        try {
            const comments = await Comment.find();
            return comments;
        } catch (err) {
            throw err;
        }
    },
    getCommentsByPostId: async (postId) => {
      try {
        const comments = await Comment.find({postId: postId});
        console.log("포스트아이디 체크포인트 2", comments, postId)
        return comments;
      } catch (err) {
        throw new err;
      }
    },
    updateComment: async (CommentId, newCommentData) => {
        try {
            const updatedComment = await Comment.findByIdAndUpdate(CommentId, newCommentData, {
                new: true,
            });
            return updatedComment;
        } catch (err) {
            throw err;
        }
    },

    deleteComment: async (CommentId) => {
        try {
            const deletedComment = await Comment.findByIdAndDelete(CommentId);
            return deletedComment;
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

export default CommentService;