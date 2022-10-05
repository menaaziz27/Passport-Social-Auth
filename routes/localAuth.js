const { requireLocalAuth } = require('../middlewares/requireLocalAuth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const Joi = require('joi');
const { registerSchema } = require('../validators/register');
const { validateRequest } = require('../middlewares/validateRequest');
const { loginSchema } = require('../validators/login');

const router = require('express').Router();

router.post(
	'/register',
	validateRequest(registerSchema),
	asyncHandler(async (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const name = req.body.name;

		const userExist = await User.findOne({ email });

		if (userExist) throw new ApiError('User already exists.', 400);

		const hashedPassword = await bcrypt.hash(password, 8);

		const user = new User({ email, password: hashedPassword, provider: 'email', name });

		await user.save();
		res.json(user);
	})
);

router.post(
	'/login',
	[validateRequest(loginSchema), requireLocalAuth],
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
