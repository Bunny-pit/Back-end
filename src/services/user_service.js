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
  createUser: async registerData => {
    try {
      const { userName, email, password } = registerData;
      const userData = {
        userName: userName,
        email: email,
        password: generateHashedPassword(password),
      };
      const existingUserCheck = await User.findOne({ email });
      const existingUserName = await User.findOne({ userName })

      if (existingUserCheck) {
        return { success: false, reason: '이미 존재하는 이메일입니다.' }
      } else if (existingUserName) {
        return { success: false, reason: '이미 사용중인 닉네임입니다.' }

      } else {
        const newUser = new User(userData);
        await newUser.save();
        return { newUser, success: true };
      }
    } catch (error) {
      console.log(error)
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
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   },
  getUserById: async oid => {
    try {
      const user = await User.findById({ _id: oid });
      return user;
    } catch (error) {
      res.status(500).json('유저 데이터 없음.');
    }
  },
  updateUser: async (updateData, res) => {
    try {
      const { email, prevPassword, newPassword, newPasswordCheck } = updateData;
      // 유저 확인
      const existingUser = await User.find({ email });
      // 기존 비밀번호 확인
      const isPasswordMatched = password => {
        return generateHashedPassword(password) === existingUser[0].password;
      };
      if (!existingUser) {
        res.status(404).json({ error: '잘못된 유저 정보 입력.' });
      } else {
        if (
          newPassword === newPasswordCheck &&
          isPasswordMatched(prevPassword)
        ) {
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
    } catch (error) {
      res.status(500).json({ 'update service 오류': error.message });
    }
  },
  deleteUser: async (withdrawalData) => {
    try {
      const { email, password, passwordCheck } = withdrawalData;
      const existingUserCheck = await User.findOne({ email });
      const isPasswordMatched = password => {
        return generateHashedPassword(password) === existingUserCheck.password;
      };

      if (
        existingUserCheck &&
        isPasswordMatched(password) &&
        password === passwordCheck
      ) {
        const deletionResult = await User.findOneAndDelete({ email });
        if (deletionResult) {
          return { success: true };
        } else {
          return { success: false, reason: '삭제 실패' };
        }
      } else {
        return { success: false, reason: '잘못된 이메일 또는 비밀번호' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete user');
    }
  },

  toggleFollow: async (followerId, followeeId) => {
    const follower = await User.findById(followerId);
    const followee = await User.findById(followeeId);

    // 이미 팔로우 중인지 확인
    const isFollowing = follower.followings.includes(followeeId);

    if (isFollowing) {
      // 언팔로우 로직
      follower.followings = follower.followings.filter(
        id => id.toString() !== followeeId,
      );
      followee.followers = followee.followers.filter(
        id => id.toString() !== followerId,
      );
    } else {
      // 팔로우 로직
      follower.followings.push(followeeId);
      followee.followers.push(followerId);
    }

    await follower.save();
    await followee.save();

    return { followed: !isFollowing }; // 현재 팔로우 상태 반환 (팔로우 했으면 true, 언팔로우 했으면 false)
  },

  // 팔로우 목록 조회
  async getFollowings(userId) {
    const user = await User.findById(userId).populate('followings');
    return user.followings;
  },

  // 팔로워 목록 조회
  async getFollowers(userId) {
    const user = await User.findById(userId).populate('followers');
    return user.followers;
  },
};

export default UserService;
