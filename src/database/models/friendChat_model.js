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
      ref: 'Message',
    },
  ],
  lastMessage: {
    type: SchemaTypes.ObjectId,
    ref: 'Message',
    default: null,
  },
});

const FriendChat = mongoose.model('friendChat', FriendChatSchema);
export default FriendChat;
