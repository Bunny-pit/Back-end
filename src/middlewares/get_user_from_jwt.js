import passport from "passport";

export default function(req, res, next){
    if(!req.cookies.token){
        next();
        return;
    }
    return passport.authenticate('jwt', {session : false})(req,res,next);
}