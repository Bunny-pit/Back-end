import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'sha256'

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        maxlength: 8,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: 1,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: true
    },
    role: {
        type: Number,
        // 0은 일반 유저 1은 관리자.
        default: 0,
        // 유저가 역할을 입력하더라도 0으로 고정
        set: () => 0
    },
},
    { timestamps: true }
);

// @param {*} password
userSchema.methods.comparePassword = function comparePassword(password) {
    return this.hashedPassword === sha256(password)
};

const User = mongoose.model('User', userSchema);
export default User;




