const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { loginSchema } = require('../validators/login');

const passportLogin = new localStrategy(
	{ usernameField: 'email', passReqToCallback: true },
	async (req, email, password, done) => {
		const { error } = loginSchema.validate(req.body);
		if (error) return done(null, false, { message: error.details[0].message });

		try {
			const user = await User.findOne({ email: email });
			if (!user) {
				return done(null, false, { message: 'Email does not exists.' });
			}
			// match his pw
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) {
					return done(err);
				}
				if (!isMatch) {
					return done(null, false, { message: 'password incorrect' });
				}
				return done(null, user);
			});
		} catch (e) {
			console.log(e);
		}
	}
);

passport.use(passportLogin);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});
