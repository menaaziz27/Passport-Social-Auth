const passport = require('passport');

exports.requireJwtAuth = passport.authenticate('jwt', { session: false });
