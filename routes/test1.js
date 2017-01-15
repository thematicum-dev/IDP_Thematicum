var express = require('express');
var router = express.Router();
var controller = require('./test1controller');

router.route('/catalogue')
    .get(controller.apiGET);

module.exports = router;

