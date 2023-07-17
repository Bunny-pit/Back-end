import {User} from "../database/models/index.js";

export default async function adminCheck(req, res, next) {
    const email = req.body.email;
    const roleCheck = await User.find({ email });
    if (!roleCheck.role === 1) {
        res.Status(400).json('관리자 권한 부재')
        return;
    } else {
        next();
    }
}; 