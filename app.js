const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const { connectToDb } = require('./db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	expressSession({
		secret: 'thisissecret12893',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());
require('./config/passportLocalStrategy')(passport);

const getSession = (req, res) => {
	console.log(req.session);
	res.json({ session: req.session });
};

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/dashboard');
};

app.get('/dashboard', async (req, res) => {
	// console.log(req.session);
	console.log(req.user);
	const currentUserId = req.session?.passport?.user;
	const user = await User.findById(currentUserId);
	res.render('dashboard', { user });
});

app.get('/failure', (req, res) => {
	console.log('failure');
	res.render('failure');
});

app.get('/protected', isAuthenticated, (req, res) => {
	res.render('protected');
});

app.get('/session', getSession);

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	console.log(req.body);

	try {
		const hashedPassword = await bcrypt.hash(password, 8);

		const user = new User({ email, password: hashedPassword });

		await user.save();
		res.redirect('/login');
	} catch (e) {
		console.log(e);
	}
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res, next) => {
	console.log('in login');
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) return next(new Error(info?.message));
		req.login(user, err => {
			if (err) return next(err);

			return res.render('dashboard', { user });
		});
	})(req, res, next);
});

app.get('/logout', async (req, res) => {
	req.logout(err => {
		if (err) console.log(err);
		req.session.destroy(err => {
			res.redirect('/dashboard');
		});
	});
});

app.get('/current', isAuthenticated, (req, res) => {
	res.json(req.session);
});

app.use((error, req, res, next) => {
	res.render('error', {
		error,
	});
});

connectToDb()
	.then(_ => {
		app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
	})
	.catch(e => console.log(e));
