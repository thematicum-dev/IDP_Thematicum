var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');

router.route('/signup')
    .post(authController.signup);
router.route('/signin')
    .post(authController.signin);
router.route('/isAuthenticated')
    .get(authController.isAuthenticated);

module.exports = router;
