import { Schema, model, Document } from "mongoose";

interface IMainhome extends Document {
  user_id: string;
  name: string;
  profileImage: string;
  content: string;
}

const MainhomeSchema = new Schema<IMainhome>(
  {
    user_id: {
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

export default model<IMainhome>("Mainhome", MainhomeSchema);
