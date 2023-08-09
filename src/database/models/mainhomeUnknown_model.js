import mongoose from 'mongoose';

const mainhomeUnknownSchema = new mongoose.Schema(
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

const MainhomeUnknown = mongoose.model(
  'MainhomeUnknown',
  mainhomeUnknownSchema,
);
export default MainhomeUnknown;
