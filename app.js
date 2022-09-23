const express = require('express');
const passport = require('passport');
const expressListEndpoints = require('express-list-endpoints');
require('dotenv').config();
const { connectToDb } = require('./db');
const PORT = 3000;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
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
