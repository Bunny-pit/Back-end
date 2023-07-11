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
    createUser: async (registerData, res) => {
        try {
            const userData = {
                userName: registerData.userName,
                email: registerData.email,
                password: generateHashedPassword(registerData.password)
            }
            const existingUserCheck = await User.findOne({ email: registerData.email });
            if (!existingUserCheck) {
                const newUser = new User(userData);
                await newUser.save();
                return newUser;
            } else {
                generateServerErrorCode(res, 403, 'register email error', USER_EXISTS_ALREADY, 'email')
            }

        } catch (err) {
            generateServerErrorCode(res, 500, err, SOME_THING_WENT_WRONG);
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