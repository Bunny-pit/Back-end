import User from '../database/models/user_model.js';
import { uploadToS3 } from '../config/s3.js';

import { generateHashedPassword } from '../lib/utils.js';

const UserService = {
  createUser: async registerData => {
    try {
      const { userName, email, password, introduction } = registerData;
      const userData = {
        userName: userName,
        email: email,
        password: generateHashedPassword(password),
        profileImg:
          'https://bunny-post-bucket.s3.ap-northeast-2.amazonaws.com/profileImage.png',
        introduction: introduction,
      };
      const existingUserCheck = await User.findOne({ email });
      const existingUserName = await User.findOne({ userName });

      if (existingUserCheck) {
        return { success: false, reason: '이미 존재하는 이메일입니다.' };
      } else if (existingUserName) {
        return { success: false, reason: '이미 사용중인 닉네임입니다.' };
      }
      const newUser = new User(userData);
      await newUser.save();
      return { newUser, success: true };
    } catch (error) {
      console.log(error);
    }
  },

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
            {
              password: generateHashedPassword(newPassword),
            },
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
  deleteUser: async withdrawalData => {
    try {
      const { email, password, passwordCheck, introduction } = withdrawalData;
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

  toggleFollow: async (followerName, followeeName) => {
    const follower = await User.findOne({ userName: followerName });
    const followee = await User.findOne({ userName: followeeName });

    if (!follower || !followee) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 이미 팔로우 중인지 확인
    const isFollowing = follower.followings.indexOf(followeeName) !== -1;

    if (isFollowing) {
      // 언팔로우 로직
      follower.followings.pull(followeeName);
      followee.followers.pull(followerName);
    } else {
      // 팔로우 로직
      follower.followings.push(followeeName);
      followee.followers.push(followerName);
    }

    await follower.save();
    await followee.save();

    return { followed: !isFollowing }; // 현재 팔로우 상태 반환 (팔로우 했으면 true, 언팔로우 했으면 false)
  },

  // 팔로우 목록 조회
  async getFollowings(userName) {
    const user = await User.findOne({ userName: userName });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return user.followings;
  },

  // 팔로워 목록 조회
  async getFollowers(userName) {
    const user = await User.findOne({ userName: userName });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return user.followers;
  },
  // 관리자 유저삭제
  adminDeleteUser: async email => {
    try {
      // 사용자가 존재하는지 확인
      const user = await User.findOne({ email });

      if (!user) {
        return { success: false, reason: '해당하는 사용자가 없습니다.' };
      }

      // 사용자 삭제
      await User.deleteOne({ email });

      return {
        success: true,
        message: '사용자 정보가 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      console.error(error);
      return { success: false, reason: '서버 오류 발생' };
    }
  },

  //post 프로필 수정
  // async editProfile(req) {
  //   try {
  //     const user = await User.findById({ _id: req.oid });
  //     // const profileImg = user.profileImg;
  //     const result = await uploadToS3(req.file);
  //     const newImage = await User.findByIdAndUpdate(
  //       req.oid,
  //       {
  //         profileImg: result.url,
  //       },
  //       { new: true }
  //     );
  //     return { success: true };
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  async editProfile(req) {
    try {
      let updatedUser;
      const user = await User.findById({ _id: req.oid });

      if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
      }

      // 이미지 파일이 있다면 S3에 업로드
      if (req.file) {
        const result = await uploadToS3(req.file);
        user.profileImg = result.url;
      }

      // introduction이 있다면 업데이트
      if (req.body.introduction) {
        user.introduction = req.body.introduction;
      }

      // 변경 사항 저장
      updatedUser = await user.save();

      if (!updatedUser) {
        throw new Error('정보 업데이트에 실패했습니다.');
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
