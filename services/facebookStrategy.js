const passport = require('passport');
const { Strategy: FacebookStrategy } = require('passport-facebook');

const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

const facebookLogin = new FacebookStrategy(
	{
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_SECRET,
		callbackURL: `${serverUrl}${process.env.FACEBOOK_CALLBACK_URL}`,
		profileFields: [
			'id',
			'email',
			'gender',
			'profileUrl',
			'displayName',
			'locale',
			'name',
			'timezone',
			'updated_time',
			'verified',
			'picture.type(large)',
		],
	},
	asyncHandler(async (accessToken, refreshToken, profile, done) => {
		const oldUser = await User.findOne({ email: profile.emails[0].value });

		if (oldUser) {
			return done(null, oldUser);
		}

		const newUser = await new User({
			provider: 'facebook',
			username: `user${profile.id}`,
			email: profile.emails[0].value,
			name: profile.displayName,
		}).save();

		done(null, newUser);
	})
);

passport.use(facebookLogin);
