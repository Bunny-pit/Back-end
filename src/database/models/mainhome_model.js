import mongoose from 'mongoose';

const mainhomeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
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
