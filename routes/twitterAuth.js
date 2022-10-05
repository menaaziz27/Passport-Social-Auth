const passport = require('passport');
const router = require('express').Router();

router.get(
	'/twitter',
	passport.authenticate('twitter', {
		scope: ['profile', 'email'],
	})
);

router.get(
	`/twitter/callback`,
	passport.authenticate('twitter', {
		session: false,
	}),
	(req, res, next) => {
		const token = req.user.generateJWT();
		const user = req.user;
		res.cookie('x-auth-cookie', token, { httpOnly: true });
		res.json({ token, user });
	}
);

module.exports = router;
