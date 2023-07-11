import UserService from "../services/user_service.js";
import jwt from 'jsonwebtoken';

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
    async getUser(req, res){
        try{
            const savedUser = await User.find({})
            res.send(savedUser);
            return;
        } catch (err){
            console.log(err)
        }
    },
    async loginUser(req, res) {
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
                const isPasswordMatched = user.comparePassword(password);
                if (isPasswordMatched) {
                    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY,
                        { expiresIn: 1000 * 60 * 60 }); // 1시간 뒤 만료
                    const userToReturn = { ...user.toJSON(), ...{ token } };
                    delete userToReturn.hashedPassword;
                    res.status(200).json(userToReturn);
                } else {
                    generateServerErrorCode(res, 403, '로그인 패스워드 오류', WRONG_PASSWORD, 'password')
                }
            } else {
                generateServerErrorCode(res, 404, '로그인 이메일 오류', USER_DOES_NOT_EXIST, 'email');
            }

            const userData = {
                email,
                password
            }
            const userInfo = await UserService.loginUser(userData);
            if (!userInfo) {

            }
            res.status(201).json(userInfo)
        } catch (err) {
            throw err;
        }
    },
    async updateUser(req, res) {
        try {
            const { userName, password } = req.body
            const updateData = {
                userName,
                password
            }
            const updatedUser = await UserService.updateUser(updateData);
            res.status(201).json(updatedUser);

        } catch (err) {
            res.status(500).json({ err: err.message })
        }
    },
    async deleteUser(req, res) {
        try {
            const { email, userName, password } = req.body;

        } catch (err) {
            console.log("유저삭제 실패")
        }
    }
}
export default UserController;

    // jwt로 password 업데이트. jwt를 db에 저장해서 보안성 강화하는 방법도 있음.(근데 jwt는 db안쓰려고 사용.)
    // 구글 원격 강제 로그아웃기능 이 방식으로 구현.
    //jwt는 로그아웃이 안되니 만료를 짧게.
    //유저컨트롤러 수정 필요.