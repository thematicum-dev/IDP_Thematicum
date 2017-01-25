var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin.controller');

router.route('/accesscodes')
    .get(adminController.listAccessCodes);

module.exports = router;