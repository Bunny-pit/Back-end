import UserService from '../services/user_service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../database/models/user_model.js';

// import { validationResult } from 'express-validator';

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

dotenv.config();

const UserController = {
  async createUser(req, res) {
    try {
      const { userName, email, password } = req.body;
      const registerData = {
        userName,
        email,
        password,
      };
      const createdUser = await UserService.createUser(registerData);
      if (createdUser.success) {
        res.status(201).json({ '계정 생성 성공 ': createdUser.newUser });
      } else if (!createdUser.success) {
        res.status(403).json({
          error: createdUser.reason,
          code: '회원 가입 실패',
        });
      }
    } catch (error) {
      res.status(500).json({
        error: `회원 가입 오류 발생 - ${error.message}`,
      });
    }
  },
  async getUser(req, res) {
    try {
      const userOid = req.oid;
      const userData = await UserService.getUserById(userOid);

      res.status(200).json({ data: { userData: userData } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getAllUser(req, res) {
    try {
      const userData = await User.find({});
      res.status(200).json({ data: userData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && user.email) {
        const isPasswordMatched = password => {
          return generateHashedPassword(password) === user.password;
        };
        const payload = {
          userOid: user._id,
          userId: user.userId,
          email: user.email,
          userName: user.userName,
          role: user.role,
        };
        if (isPasswordMatched(password)) {
          const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
            expiresIn: '2h', // 1시간 뒤 만료
            issuer: 'BunnyPit',
          });
          const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET_KEY, {
            expiresIn: '3d', // 2시간 뒤 만료
            issuer: 'BunnyPit',
          });
          res.cookie('accessToken', accessToken, {
            secure: false,
            httpOnly: true,
          });
          res.cookie('refreshToken', refreshToken, {
            secure: false,
            httpOnly: true,
          });
          res.status(200).json({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          return generateServerErrorCode(
            res,
            403,
            '비밀번호가 일치하지 않습니다.',
            WRONG_PASSWORD,
            'password',
          );
        }
      } else {
        return generateServerErrorCode(
          res,
          404,
          '회원가입이 필요합니다.',
          USER_DOES_NOT_EXIST,
          'email',
        );
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async logout(req, res) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(200).json({ message: '로그아웃 완료' });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async updateUser(req, res) {
    try {
      const { email, prevPassword, newPassword, newPasswordCheck } = req.body;
      const updateData = {
        email,
        prevPassword,
        newPassword,
        newPasswordCheck,
      };
      const result = await UserService.updateUser(updateData, res);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: '서버 오류 발생',
        code: 'SOME_THING_WENT_WRONG',
      });
    }
  },
  async deleteUser(req, res) {
    try {
      const { email, password, passwordCheck } = req.body.withdrawalData;
      console.log(req.body);
      const withdrawalData = {
        email,
        password,
        passwordCheck,
      };
      const deletionResult = await UserService.deleteUser(withdrawalData);

      if (deletionResult.success) {
        res.status(200).json('계정 삭제 성공');
      } else if (!deletionResult.success) {
        res.status(400).json({
          error:
            '계정 삭제 실패, 유저 데이터 존재하지 않거나 비밀번호가 불일치합니다.',
          code: 'USER_DELETION_FAILED',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: '서버 오류 발생',
        code: 'SOME_THING_WENT_WRONG',
      });
    }
  },
  async accessToken(req, res) {
    try {
      const userToken = req.headers['authorization']?.split(' ')[1];
      // console.log('userToken', userToken)
      const decodedData = jwt.verify(userToken, process.env.ACCESS_SECRET_KEY);

      const userEmail = decodedData.email;

      const userData = await User.findOne({ email: userEmail });

      res.status(200).json({ userData: userData });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    try {
      const decodedData = jwt.verify(
        refreshToken,
        process.env.ACCESS_SECRET_KEY,
      );

      const refreshedToken = jwt.sign(
        decodedData,
        process.env.ACCESS_SECRET_KEY,
        {
          expiresIn: '2h',
          issuer: 'bunny pit',
        },
      );

      res.status(200).json({ accessToken: refreshedToken });
    } catch (error) {
      res.status(401).json({ error: 'refresh 토큰 생성 실패, 유효하지 않음.' });
    }
  },

  //  토글로 팔로우 , 팔로우 취소
  async toggleFollow(req, res) {
    try {
      const user = await User.findById(req.oid);
      if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }

      const followerName = user.userName;
      const { followeeName } = req.body;
      const result = await UserService.toggleFollow(followerName, followeeName);

      if (result.followed) {
        res.status(200).json({ message: '팔로우에 성공했습니다.' });
      } else {
        res.status(200).json({ message: '언팔로우에 성공했습니다.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 팔로우 목록 조회
  async getFollowings(req, res) {
    try {
      const { userName } = req.body;
      const followings = await UserService.getFollowings(userName);
      res.status(200).json(followings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 팔로워 목록 조회
  async getFollowers(req, res) {
    try {
      const { userName } = req.body;
      const follower = await UserService.getFollowers(userName);
      res.status(200).json(follower);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //유저검색
  async searchUser(req, res) {
    try {
      const { userName } = req.query;
      const userData = await User.find({
        userName: { $regex: userName, $options: 'i' },
      });

      if (userData && userData.length > 0) {
        res.status(200).json({ user: userData });
      } else {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
export default UserController;

// jwt로 password 업데이트. jwt를 db에 저장해서 보안성 강화하는 방법도 있음.(근데 jwt는 db안쓰려고 사용.)
// 구글 원격 강제 로그아웃기능 이 방식으로 구현.
//jwt는 로그아웃이 안되니 만료를 짧게.
