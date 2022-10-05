require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const { connectToDb } = require('./utils/db');
const { requireJwtAuth } = require('./middlewares/requireJwtAuth');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser('ThisismySecretKeyDqwe'));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(cors('*'));
require('./services/passportLocalStrategy');
require('./services/jwtStrategy');
require('./services/googleStrategy');
require('./services/facebookStrategy');
require('./services/githubStrategy');
// require('./services/twitterStrategy');

app.use(morgan('tiny'));
app.use(require('./routes'));

app.get('/protected', requireJwtAuth, (req, res) => {
	console.log(req.user);
	res.json(`welcome in home screen ${req.user.name}!`);
});

app.use(notFound);
app.use(errorHandler);

connectToDb()
	.then(_ => {
		app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
	})
	.catch(e => console.log(e));
