const express = require('express');
const passport = require('passport');
const cors = require('cors');
const expressListEndpoints = require('express-list-endpoints');
require('dotenv').config();
const { connectToDb } = require('./db');
const PORT = 3000;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(cors('*'));
require('./services/passportLocalStrategy');
require('./services/jwtStrategy');
require('./services/googleStrategy');

app.use('*', (req, res, next) => {
	let current_datetime = new Date();
	let formatted_date =
		current_datetime.getFullYear() +
		'-' +
		(current_datetime.getMonth() + 1) +
		'-' +
		current_datetime.getDate() +
		' ' +
		current_datetime.getHours() +
		':' +
		current_datetime.getMinutes() +
		':' +
		current_datetime.getSeconds();
	let method = req.method;
	let url = req.url;
	let status = res.statusCode;
	let log = `[${formatted_date}] ${method}:${url} ${status}`;
	console.log(log);
	next();
});

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
