import UserService from "../services/user_service.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../database/models/user_model.js'

import { validationResult } from 'express-validator';

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
            const { userName, email, password } = req.body
            const registerData = {
                userName,
                email,
                password
            }
            const newUser = await UserService.createUser(registerData);
            console.log('newUser', newUser);
            res.status(201).json({ newUser: newUser });
        } catch (err) {
            res.status(500).json({ err: err.message })
        }
    },
    async getUser(req, res) {
        try {
            const savedUser = await User.find({})
            res.status(200).json({ data: savedUser });
        } catch (err) {
            console.log(err)
        }
    },
    async loginUser(req, res, next) {
        try {
            const errorsAfterValidation = validationResult(req);
            if (!errorsAfterValidation.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    errors: errorsAfterValidation.mapped()
                });
            }
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (user && user.email) {
                const isPasswordMatched = password => {
                    return generateHashedPassword(password) === user.password
                }
                if (isPasswordMatched(password)) {
                    const accessToken = jwt.sign({
                        userId: user.userId,
                        email: user.email,
                        userName: user.userName,
                    }, process.env.ACCESS_SECRET_KEY,
                        {
                            expiresIn: 1000 * 60 * 60, // 1시간 뒤 만료
                            issuer: 'BunnyPit'
                        });
                    const refreshToken = jwt.sign({
                        userId: user.userId,
                        email: user.email,
                        userName: user.userName,
                    }, process.env.REFRESH_SECRET_KEY,
                        {
                            expiresIn: 1000 * 60 * 60 * 2, // 2시간 뒤 만료
                            issuer: 'BunnyPit'
                        });

                    res.cookie('access token', accessToken, {
                        secure: false,
                        httpOnly: true,
                    })
                    res.cookie('refresh token', refreshToken, {
                        secure: false,
                        httpOnly: true,
                    })
                    res.status(200).json("로그인 성공");
                } else {
                    generateServerErrorCode(res, 403, '비밀번호가 일치하지 않습니다.', WRONG_PASSWORD, 'password')
                }
            } else {
                generateServerErrorCode(res, 404, '회원가입이 필요합니다.', USER_DOES_NOT_EXIST, 'email');
            }

        } catch (err) {
            res.status(500).json(err)
        }
    },
    async updateUser(req, res) {
        try {
            const { email, prevPassword, newPassword } = req.body
            const updateData = {
                email,
                prevPassword,
                newPassword
            }
            const updatedUser = await UserService.updateUser(updateData, res);
            res.status(201).json({ '유저 정보 업데이트 완료': updatedUser });
        } catch (err) {
            res.status(500).json({ 'update controller 오류': err.message })
        }
    },
    async deleteUser(req, res) {
        try {
            const { email, password } = req.body;
            const userData = {
                email,
                password
            }
            await UserService.deleteUser(userData, res)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}
export default UserController;

    // jwt로 password 업데이트. jwt를 db에 저장해서 보안성 강화하는 방법도 있음.(근데 jwt는 db안쓰려고 사용.)
    // 구글 원격 강제 로그아웃기능 이 방식으로 구현.
    //jwt는 로그아웃이 안되니 만료를 짧게.
