const passport = require('passport');
const router = require('express').Router();

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

router.get(
	`/google/callback`,
	passport.authenticate('google', {
		session: false,
	}),
	(req, res) => {
		const token = req.user.generateJWT();
		const user = req.user;
		res.cookie('x-auth-cookie', token, { httpOnly: true });
		res.json({ token, user });
	}
);

module.exports = router;
