import { Strategy, ExtractJwt } from 'passport-jwt';
import { config, underscoreId } from './config.js';
import { User } from '../database/models/index.js';

export const applyPassportStrategy = passport => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = config.passport.secret;
  passport.use(
    new Strategy(options, (payload, done) => {
      User.findOne({ email: payload.email }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, {
            email: user.email,
            _id: user[underscoreId],
          });
        }
        return done(null, false);
      });
    }),
  );
};
