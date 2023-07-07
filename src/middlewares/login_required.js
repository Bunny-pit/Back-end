import User from '../models/User.js';

export default function (req, res, next){
    if(!req.user){
        res.redirect("/");
        return;
    }
    next();
}