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
            const { email, userName } = userData;
            const existingUserCheck = await User.findOne({ email, userName })
            if (existingUserCheck) {
                const { userId } = existingUserCheck;
                const deleteUser = await User.findByIdAndDelete(userId);
                return deleteUser;
            } else {
                generateServerErrorCode(res, 403, 'deleting user error', 'USER_ID_NOT_FOUND', 'deleteUser')
            }

        } catch (err) {
            generateServerErrorCode(res, 500, err, SOME_THING_WENT_WRONG)
        }
    },
};

export default UserService;