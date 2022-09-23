const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');
const User = require('../models/User');

const googleLogin = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: 'http://localhost:3000/auth/google/callback',
		// proxy: true,
		// scope: '',
		// passReqToCallback: true,
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const oldUser = await User.findOne({ email: profile.email });
			if (oldUser) {
				return done(null, oldUser);
			}
		} catch (e) {
			console.log(e);
		}

		// if there's no user create him in the database and return him
		try {
			const user = new User({
				provider: 'google',
				googleId: profile.id,
				username: `user${profile.id}`,
				email: profile.email,
				name: profile.displayName,
				avatar: profile.picture,
			});

			console.log({ user });
			await user.save();
		} catch (e) {
			console.log(e);
		}
	}
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
