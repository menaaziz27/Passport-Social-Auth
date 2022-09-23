const passport = require('passport');

exports.requireLocalAuth = (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(422).send(info);
		}
		req.user = user;
		next();
	})(req, res, next);
};
