//user-schema

import { Schema } from "mongoose";
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userNickName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default:
      "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F2513B53E55DB206927",
  },
  role: {
    type: String,
    default: "basic-user", //admin, disabled role존재
  },
});

export { userSchema };
