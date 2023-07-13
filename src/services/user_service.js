import User from '../database/models/user_model.js'

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
            const { userName, email, password } = registerData;
            const userData = {
                userName: userName,
                email: email,
                password: generateHashedPassword(password)
            }
            const existingUserCheck = await User.findOne({ email: email });
            console.log('existingUserCheck', existingUserCheck)
            if (existingUserCheck) {
                generateServerErrorCode(res, 403, '이미 사용중인 이메일입니다.', USER_EXISTS_ALREADY, 'email')
            } else {
                const newUser = new User(userData);
                await newUser.save();
                console.log('service newUser', newUser);
                return newUser;
            }

        } catch (err) {
            generateServerErrorCode(res, 500, err, SOME_THING_WENT_WRONG);
        }
    },
    loginUser: async (userData) => {
        try {
            const userInfo = await User.findOne({
                email: userData.email,
                password: generateHashedPassword(userData.password)
            });
            return userInfo;
        } catch (err) {
            throw err;
        }
    },
    updateUser: async (updateData, res) => {
        try {
            const { email, prevPassword, newPassword } = updateData;
            // 유저 확인
            const existingUser = await User.find({ email : email });
            // 기존 비밀번호 확인
            const isPasswordMatched = (password) => {
                return generateHashedPassword(password) === existingUser[0].password;
            };
            if (!existingUser) {
                res.status(404).json({ error: 'USER_NOT_FOUND', existingUser: `${existingUser}` });
            } else {
                if (isPasswordMatched(prevPassword)) {
                    await User.findOneAndUpdate({ email }, { password: generateHashedPassword(newPassword) });
                    res.status(200).json('비밀번호 변경 완료')

                } res.status(400).json({ 'user service오류': '기존 비밀번호와 입력한 비밀번호 불일치.' })
            }


        } catch (err) {
            res.status(500).json({ 'update service 오류': err.message })
        }
    },
    deleteUser: async (userData, res) => {
        try {
            const { email, password } = userData;
            const existingUserCheck = await User.findOne({ email });

            const isPasswordMatched = (password) => {
                return generateHashedPassword(password) === existingUserCheck.password;
            };

            if (existingUserCheck && isPasswordMatched(password)) {
                const deletionResult = await User.deleteOne({ email });
                //삭제가 성공적인지 확인
                if (deletionResult.deletedCount === 1) {
                    res.send(200).json('계정 삭제 성공')
                    return;
                } else {
                    generateServerErrorCode(res, 500, 'Failed to delete user', 'USER_DELETION_FAILED');
                }
            } else {
                generateServerErrorCode(res, 403, 'Deleting user error', 'USER_ID_NOT_FOUND');
            }
        } catch (err) {
            generateServerErrorCode(res, 500, err, 'SOME_THING_WENT_WRONG');
        }
    }
};
//오류날경우 삭제 안 되도록 코드 짜야함.
export default UserService;