import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    userId: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;

