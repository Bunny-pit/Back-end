import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

async function getRandomName() {
  try {
    const response = await axios.get(
      'https://nickname.hwanmoo.kr/?format=json&count=2',
    );
    const nickname = response.data.words[0];
    // console.log('response', response)
    return nickname;
  } catch (error) {
    // API 호출 실패 시 기본값 설정
    console.error('API 호출에 실패했습니다. 기본값으로 대체합니다.');
    return '익명의';
  }
}

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
      required: true,
    },
    profileImg: {
      type: String,
      default: null,
    },
    secretName: {
      type: String,
      unique: true,
      required: true,
      default: `${await getRandomName()} 버니`,
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
      // 0은 일반 유저 1은 관리자.
      type: Number,
      default: 0,
    },
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  try {
    this.secretName = await getRandomName() + ' 버니';
  } catch (error) {
    console.error('Secret name 생성에 실패했습니다. 기본값으로 대체합니다.');
    this.secretName = '익명의 버니';
  }
  return next();
});

const User = mongoose.model('User', userSchema);
export default User;
