var express = require('express');
var router = express.Router();
var stocksController = require('../controllers/stocks.controller');
var authUtilities = require('../utilities/authUtilities');

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/')
    .get(stocksController.list);

module.exports = router;