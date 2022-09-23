const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const expressListEndpoints = require('express-list-endpoints');
require('dotenv').config();
const { connectToDb } = require('./db');
const PORT = 3000;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
// 	expressSession({
// 		secret: 'thisissecret12893',
// 		resave: true,
// 		saveUninitialized: true,
// 	})
// );

app.use(passport.initialize());
// app.use(passport.session());
require('./services/passportLocalStrategy');
require('./services/jwtStrategy');

app.use(require('./routes'));

app.use((error, req, res, next) => {
	res.json(error);
});

// console.log(expressListEndpoints(app));

connectToDb()
	.then(_ => {
		app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
	})
	.catch(e => console.log(e));
