const { requireLocalAuth } = require('../middlewares/requireLocalAuth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');

const router = require('express').Router();

router.post(
	'/register',
	asyncHandler(async (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const name = req.body.name;

		const userExists = await User.findOne({ email });
		if (userExists) throw new ApiError('User already exists', 422);

		const hashedPassword = await bcrypt.hash(password, 8);
		const user = new User({ email, password: hashedPassword, provider: 'email', name });
		console.log({ user });
		await user.save(); // error
		res.json(user);
	})
);

router.post(
	'/login',
	requireLocalAuth,
	asyncHandler((req, res, next) => {
		const token = req.user.generateJWT();
		const me = req.user;
		res.json({ token, me });
	})
);

// the logout functionality will be from the frontend
// router.get('/logout', async (req, res) => {
// 	req.logout(err => {
// 		if (err) return next(new ApiError(err.message, 400));
// 		req.session.destroy(err => {
// 			res.redirect('/dashboard');
// 		});
// 	});
// });

module.exports = router;
