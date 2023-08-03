import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';

async function getRandomName() {
  try {
    const response = await axios.get('https://nickname.hwanmoo.kr/?format=json&count=2');
    const nickname = response.data.words[0];
    console.log('response', response)
    return nickname;
  } catch (error) {
    // API 호출 실패 시 기본값 설정
    console.error('API 호출에 실패했습니다. 기본값으로 대체합니다.');
    return '익명의';
  }
}
const secretName = await getRandomName()

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
    profileImg: {
      type: String,
      default: null
    },
    secretName: {
      type: String,
      unique: true,
      required: true,
      default: `${secretName} 버니`,
    },
    email: {
      type: String,
      unique: true,
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
