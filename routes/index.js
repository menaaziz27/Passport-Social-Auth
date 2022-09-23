const { application } = require('express');
const localAuthRoutes = require('./localAuth');
// const googleAuthRoutes = require('./googleAuth');
// const facebookAuthRoutes = require('./facebookAuth');
const router = require('express').Router();

router.use('/auth', localAuthRoutes);
// router.use('/auth', googleAuthRoutes);
// router.use('/auth', facebookAuthRoutes);
// router.use('/api', apiRoutes);

module.exports = router;
