import { Strategy, ExtractJwt } from 'passport-jwt';
import { secretKey } from '../../lib/utils/jwt.js'

const cookieExtractor = req => {
    const { token } = req.cookies;
    return token;
}

const opts = {
    secretOrKey : secretKey,
    jwtFromRequest : cookieExtractor,
}

export default new JwtStrategy(opts, (user, done)=>{
    done(null,user);
})