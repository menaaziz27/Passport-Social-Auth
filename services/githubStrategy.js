const passport = require('passport');
const { Strategy: GithubStrategy } = require('passport-github2');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

const githubLogin = new GithubStrategy(
	{
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: 'http://localhost:3000/auth/github/callback',
	},
	asyncHandler(async (accessToken, refreshToken, profile, done) => {
		const oldUser = await User.findOne({ githubId: profile.id });

		if (oldUser) return done(null, oldUser);

		const user = await User.create({
			provider: 'github',
			username: `user${profile.id}`,
			email: profile.emails[0].value,
			name: profile.displayName,
		});

		done(null, user);
	})
);

passport.use(githubLogin);
