const mongoose = require('mongoose');

const userSchema = new mongoose.schema({
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
        required: true
    },
    role: {
        type: Number,
        // 0은 일반 유저 1은 관리자.
        deafault: 0,

    },
    
})

const User = mongoose.model('User', userSchema)
module.exports = { User }