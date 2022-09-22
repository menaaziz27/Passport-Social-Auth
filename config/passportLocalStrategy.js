const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function (passport) {
	passport.use(
		new localStrategy({ usernameField: 'email' }, (email, password, done) => {
			User.findOne({ email: email })
				.then(user => {
					if (!user) {
						return done(null, false, {
							message: 'that email is not registered',
						});
					}

					if (user) {
						// match his pw
						bcrypt.compare(password, user.password, (err, isMatch) => {
							if (err) {
								throw new err();
							}
							if (isMatch) {
								return done(null, user);
							}
							// if not matches
							return done(null, false, { message: 'password incorrect' });
						});
					}
				})
				.catch(err => console.log(err));
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
