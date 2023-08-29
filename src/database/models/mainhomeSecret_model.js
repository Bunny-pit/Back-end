import mongoose from 'mongoose';

const mainhomeSecretSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
    },
    reports: [
      {
        reportedBy: {
          type: String,
          ref: 'User',
          required: true,
        },
        userId: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const MainhomeSecret = mongoose.model('MainhomeSecret', mainhomeSecretSchema);
export default MainhomeSecret;
