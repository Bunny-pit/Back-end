import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const randomNames = [
  '지루한',
  '따분한',
  '목마른',
  '배고픈',
  '화가난',
  '소심한',
  '당당한',
  '외로운',
  '고민중인',
  '코딩하는',
  '배아픈',
  '똥마려운',
  '요리하는',
  '공부중인',
  '화장하는',
  '유쾌한',
  '밥먹는',
];
const getRandomName = () => {
  const randomIndex = Math.floor(Math.random() * randomNames.length);
  return randomNames[randomIndex];
};

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      maxlength: 8,
      unique: true,
      required: true,
    },
    secretName: {
      type: String,
      unique: true,
      required: true,
      default: `${getRandomName()} 버니`,
    },
    email: {
      type: String,
      unique: 1,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      required: true,
    },
    role: {
      type: Number,
      // 0은 일반 유저 1은 관리자.
      default: 0,
      // 유저가 역할을 입력하더라도 0으로 고정
      // set: () => 0
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
