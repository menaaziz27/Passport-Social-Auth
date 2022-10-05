const passport = require('passport');
const router = require('express').Router();

router.get(
	'/github',
	passport.authenticate('github', {
		scope: ['user:email'],
	})
);

router.get('/github/callback', passport.authenticate('github', { session: false }), function (req, res) {
	const token = req.user.generateJWT();
	const user = req.user;

	console.log({ user });
	res.cookie('x-auth-cookie', token, { httpOnly: true });
	res.json({ token, user });
});

module.exports = router;
