const { requireLocalAuth } = require('../middlewares/requireLocalAuth');
const User = require('../models/User');

const router = require('express').Router();

router.post('/register', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	console.log(req.body);

	try {
		const hashedPassword = await bcrypt.hash(password, 8);

		const user = new User({ email, password: hashedPassword });

		await user.save();
		res.json({ user });
	} catch (e) {
		console.log(e);
	}
});

router.post('/login', requireLocalAuth, (req, res, next) => {
	const token = req.user.generateJWT();
	const me = req.user;
	res.json({ token, me });
});

router.get('/logout', async (req, res) => {
	req.logout(err => {
		if (err) console.log(err);
		req.session.destroy(err => {
			res.redirect('/dashboard');
		});
	});
});

module.exports = router;
