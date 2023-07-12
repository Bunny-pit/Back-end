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
            const userData = {
                userName: registerData.userName,
                email: registerData.email,
                password: generateHashedPassword(registerData.password)
            }
            const existingUserCheck = await User.findOne({ email: userData.email });
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
    updateUser: async (userId, newUserData) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, newUserData, {
                new: true,
            });
            return updatedUser;
        } catch (err) {
            throw err;
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