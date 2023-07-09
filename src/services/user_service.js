import User from '../database/models/user_model.js'

const UserService = {
    createUser: async (registerData) => {
        try {
            const newUser = new User(registerData);
            await newUser.save();
            return newUser;
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

    deleteUser: async (userId) => {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            return deletedUser;
        } catch (err) {
            throw err;
        }
    },
};

export default UserService;