import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId:	{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    maxlength: 500,
    required: false,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,  // Assuming profileImage is of string type
    required: false,
  },
  userName: { // userName field 추가
    type: String,
    required: true,
  },
},
  { timestamps: false },
)

const Post = mongoose.model('Post', PostSchema);
export default Post;
