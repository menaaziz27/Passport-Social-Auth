const passport = require('passport');
const { Strategy: TwitterStrategy } = require('passport-twitter');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

const googleLogin = new TwitterStrategy(
	{
		clientID: '',
		clientSecret: '',
		callbackURL: 'http://localhost:3000/auth/twitter/callback',
	},
	asyncHandler(async (accessToken, refreshToken, profile, done) => {
		const oldUser = await User.findOne({ email: profile.email });
		if (oldUser) {
			return done(null, oldUser);
		}

		const user = new User({
			provider: 'twitter',
			username: `user${profile.id}`,
			email: profile.email,
			name: profile.displayName,
			avatar: profile.picture,
		});

		await user.save();
	})
);

passport.use(googleLogin);
