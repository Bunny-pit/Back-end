import mongoose from 'mongoose';

const mainhomeSchema = new mongoose.Schema(
  {
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileImage: {
      type: String,
      // required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Mainhome = mongoose.model('Mainhome', mainhomeSchema);
export default Mainhome;
