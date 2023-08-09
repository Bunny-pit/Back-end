import mongoose from 'mongoose';
const { Schema, SchemaTypes } = mongoose;

const FriendChatSchema = new Schema({
  users: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'FriendMessage',
    },
  ],
  lastMessage: {
    type: SchemaTypes.ObjectId,
    ref: 'FriendMessage',
    default: null,
  },
});

const FriendChat = mongoose.model('FriendChat', FriendChatSchema);
export default FriendChat;
