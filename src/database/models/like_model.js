import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  liked: {
    type: Boolean,
    default: false,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: [
    {
      type: String,
      ref: 'User',
      required: true,
    },
  ],
});

export default mongoose.model('Like', LikeSchema);
