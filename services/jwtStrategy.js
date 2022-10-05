const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/User');

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

const jwtLogin = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey,
	},
	async (payload, done) => {
		try {
			const user = await User.findById(payload.id);

			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		} catch (err) {
			done(err, false);
		}
	}
);

passport.use(jwtLogin);
