const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

const googleLogin = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
	},
	asyncHandler(async (accessToken, refreshToken, profile, done) => {
		const oldUser = await User.findOne({ email: profile.email });
		if (oldUser) {
			return done(null, oldUser);
		}

		const user = new User({
			provider: 'google',
			username: `user${profile.id}`,
			email: profile.email,
			name: profile.displayName,
			avatar: profile.picture,
		});

		await user.save();
	})
);

passport.use(googleLogin);

// passport.serializeUser((user, done) => {
// 	done(null, user.googleId || user.id);
// });

// passport.deserializeUser((googleId, done) => {
// 	database.findOne({ googleId: googleId }, (err, user) => {
// 		done(null, user);
// 	});
// });
