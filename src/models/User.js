import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        maxlength: 8,
        unique: 1,
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
        minlength : 8,
        required: true
    },
    role: {
        type: Number,
        // 0은 일반 유저 1은 관리자.
        default: 0,
    },
},
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User