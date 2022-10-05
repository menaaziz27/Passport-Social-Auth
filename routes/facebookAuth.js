const Router = require('express').Router;
const passport = require('passport');
const { asyncHandler } = require('../utils/asyncHandler');

const router = Router();

router.get(
	'/facebook',
	passport.authenticate('facebook', {
		scope: ['public_profile', 'email'],
	})
);

router.get(
	'/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/',
		session: false,
	}),
	asyncHandler((req, res) => {
		const token = req.user.generateJWT();
		res.cookie('x-auth-cookie', token, { maxAge: 900000, signed: true, httpOnly: true });
		res.json({ token, user: req.user });
	})
);

module.exports = router;
