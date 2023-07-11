import mongoose from 'mongoose';
import uuid from 'uuid;'
import sha256 from 'sha256'

const userSchema = new mongoose.Schema({
    userId : {
        type : String,
        default : uuid.v4,
        unique : true,
        required : true,
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
);

// @param {*} password
userSchema.methods.comparePassword = function comparePassword(password){
    return this.hashedPassword === sha256(password)
};

const User = mongoose.model('User', userSchema);
export default User;




