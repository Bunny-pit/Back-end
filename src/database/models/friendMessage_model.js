import mongoose from 'mongoose';

const FriendMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FriendChat',
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const FriendMessage = mongoose.model('friendMessage', FriendMessageSchema);
export default FriendMessage;
