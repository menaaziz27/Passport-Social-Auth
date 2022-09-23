const passport = require('passport');
const router = require('express').Router();

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);
const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get(
	`/google/callback`,
	passport.authenticate('google', {
		session: false,
	}),
	(req, res, next) => {
		const token = req.user.generateJWT();
		console.log({ token });
		const user = req.user;
		console.log({ user });
		res.cookie('x-auth-cookie', token);
		res.redirect(clientUrl);
	}
);

module.exports = router;
