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
            await UserService.createUser(registerData);
            res.status(201).json('계정 생성 성공 ');
        } catch (err) {
            res.status(500).json({ err: err.message })
        }
    },
    async getUser(req, res) {
        try {
            const savedUser = await User.find({})
            res.status(200).json({ '유저목록': savedUser });
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
                            expiresIn: 1000 * 60 * 60, // 1시간 뒤 만료
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
                    return generateServerErrorCode(res, 403, '비밀번호가 일치하지 않습니다.', WRONG_PASSWORD, 'password')
                }
            } else {
                return generateServerErrorCode(res, 404, '회원가입이 필요합니다.', USER_DOES_NOT_EXIST, 'email');
            }

        } catch (err) {
            res.status(500).json({ err: err.message })
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
            const result = await UserService.updateUser(updateData, res);
            res.status(201).json(result);
        } catch (err) {
            throw err
        }
    },
    async deleteUser(req, res) {
        try {
            const { email, password } = req.body;
            const userData = {
                email,
                password
            };

            const deletionResult = await UserService.deleteUser(userData);
            if (deletionResult.success) {
                res.status(200).json('계정 삭제 성공');
            } else {
                res.status(500).json({
                    error: '유저 삭제 실패',
                    code: 'USER_DELETION_FAILED'
                });
            }
        } catch (err) {
            res.status(500).json({
                error: '서버 오류 발생',
                code: 'SOME_THING_WENT_WRONG'
            });
        }
    },
    async loginSuccess(req, res) {
        try {
            const token = req.cookies.accessToken;
            const data = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
            const userEmail = data.email;

            const userData = User.find({ userEmail })


            res.status(200).json({ 'loginSuccess': userData });
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async logout(req, res) {
        try {
            res.cookie('accessToken', '');
            res.status(200).json("로그아웃 완료");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async accessToken(req, res) {
        try {
            const token = req.cookies.accessToken;
            const data = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
            const userEmail = data.email;

            const userData = User.find({ userEmail })
            const { password, ...others } = userData;

            res.status(200).json({ 'accessToken 발급': others });
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async refreshToken(req, res) {
        try {
            const token = req.cookies.refreshToken;
            const data = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
            const userEmail = data.email;

            const userData = User.find({ userEmail });

            // access Token 새로 발급
            const accessToken = jwt.sign({
                userName: userData.userName,
                email: userData.email,
            }, process.env.ACCESS_SECRET_KEY, {
                expiresIn: '1m',
                issuer: 'Bunny pit',
            });

            res.cookie("accessToken", accessToken, {
                secure: false,
                httpOnly: true,
            })

            res.status(200).json("accessToken 재발급");
        } catch (err) {
            res.status(500).json(err)
        }
    },


}
export default UserController;

    // jwt로 password 업데이트. jwt를 db에 저장해서 보안성 강화하는 방법도 있음.(근데 jwt는 db안쓰려고 사용.)
    // 구글 원격 강제 로그아웃기능 이 방식으로 구현.
    //jwt는 로그아웃이 안되니 만료를 짧게.
