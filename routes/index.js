const localAuthRoutes = require('./localAuth');
const googleAuthRoutes = require('./googleAuth');
const facebookAuthRoutes = require('./facebookAuth');
const githubRoutes = require('./githubAuth');
const router = require('express').Router();

router.use('/auth', localAuthRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/auth', facebookAuthRoutes);
router.use('/auth', githubRoutes);

module.exports = router;
