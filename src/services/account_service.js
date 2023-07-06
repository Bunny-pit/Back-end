import User from '../models/User.js'

const AccountService = {
    createAccount: async registerData => {
        const newUser = new User(registerData);
        try {
            await newUser.save();
            return newUser;
        } catch (err) {
            throw err;
        }
    },
    updateAccount: async (userId, data) => {
        try {
            const updatedAccount = await User.findByIdAndUpdate(userId, data, {
                new: true,
            });
            return updatedPost;
        } catch (err) {
            throw err;
        }
    },
    deleteAccount: async userId => {
        try {
            const deletedUser = await User.finyByIdAndDelete(userId);
            return deletedUser;
        } catch (err) {
            throw err;
        }
    }
}

export default AccountService;