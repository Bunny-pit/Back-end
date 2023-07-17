import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  like: {
    type: Boolean,
    default: false
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: [{
    // type: mongoose.Schema.Types.ObjectId,
    type:String,
    ref: 'User',
    required: true
  }]
});

export default mongoose.model('Like', LikeSchema);
