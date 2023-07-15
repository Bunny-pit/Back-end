import mongoose from 'mongoose';
const { Schema, SchemaTypes } = mongoose;

const ChatSchema = new Schema({
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

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
