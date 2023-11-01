import Comment from '../database/models/comment_model.js';
import User from '../database/models/user_model.js';

const CommentService = {
  createComment: async (comment, req) => {
    try {
      const { postId } = req.params;
      const user = await User.findById({ _id: req.oid });
      const userId = user._id;
      const userName = user.userName;
      const newComment = new Comment({ comment, postId, userId, userName });
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
  getCommentsByPostId: async postId => {
    try {
      const comments = await Comment.find({ postId: postId });
      return comments;
    } catch (err) {
      throw new err();
    }
  },
  updateComment: async (CommentId, newCommentData) => {
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        CommentId,
        newCommentData,
        {
          new: true,
        },
      );
      return updatedComment;
    } catch (err) {
      throw err;
    }
  },

  deleteComment: async CommentId => {
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
