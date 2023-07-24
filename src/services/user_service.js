import User from '../database/models/user_model.js';

import {
  generateHashedPassword,
  generateServerErrorCode,
  registerValidation,
  loginValidation,
} from '../lib/utils.js';

import {
  SOME_THING_WENT_WRONG,
  USER_EXISTS_ALREADY,
  WRONG_PASSWORD,
  USER_DOES_NOT_EXIST,
} from '../lib/constant.js';

const UserService = {
  createUser: async (registerData, res) => {
    try {
      const {
        // name,
        userName,
        email,
        password } = registerData;
      const userData = {
        // name : name,
        userName: userName,
        email: email,
        password: generateHashedPassword(password),
      };
      const existingUserCheck = await User.findOne({ email });
      if (existingUserCheck) {
        res.status(403, err, '이미 사용중인 이메일입니다.');
      } else {
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
      }
    } catch (err) {
      res.status(500, err, 'create user service 오류 발생');
    }
  },
  //   loginUser: async (userData) => {
  //     try {
  //       const { email, password } = userData;
  //       const userInfo = await User.findOne({
  //         email,
  //         password: generateHashedPassword(password),
  //       });
  //       return userInfo;
  //     } catch (err) {
  //       res.status(500).json({ err: err.message });
  //     }
  //   },
  getUserById: async (oid) => {
    try {
      const user = await User.findById({ _id: oid })
      return user;
    } catch (error) {
      res.status(500).json('유저 데이터 없음.')
    }
  },
  updateUser: async (updateData, res) => {
    try {
      const { email, prevPassword, newPassword } = updateData;
      // 유저 확인
      const existingUser = await User.find({ email });
      // 기존 비밀번호 확인
      const isPasswordMatched = (password) => {
        return generateHashedPassword(password) === existingUser[0].password;
      };
      if (!existingUser) {
        res.status(404).json({ error: 'USER_NOT_FOUND' });
      } else {
        if (isPasswordMatched(prevPassword)) {
          await User.findOneAndUpdate(
            { email },
            { password: generateHashedPassword(newPassword) },
          );
          res.status(200).json('비밀번호 변경 완료');
        } else {
          res.status(400).json({
            'user service오류': '기존 비밀번호와 입력한 비밀번호 불일치.',
          });
        }
      }
    } catch (err) {
      res.status(500).json({ 'update service 오류': err.message });
    }
  },
  deleteUser: async (userData) => {
    try {
      const { email, password } = userData;
      const existingUserCheck = await User.findOne({ email });
      const isPasswordMatched = (password) => {
        return generateHashedPassword(password) === existingUserCheck.password;
      };

      if (existingUserCheck && isPasswordMatched(password)) {
        const deletionResult = await User.findOneAndDelete({ email });
        // 삭제가 성공적인지 확인
        if (deletionResult.deletedCount === 1) {
          return { success: true };
        } else {
          return { success: false };
        }
      } else {
        return { success: false };
      }
    } catch (err) {
      throw new Error('Failed to delete user');
    }
  },
};
//오류날경우 삭제 안 되도록 코드 짜야함.
export default UserService;
