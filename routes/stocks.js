var express = require('express');
var router = express.Router();
var Stock = require('../models/stock');

router.get('/', function(req, res, next) {
    Stock.find({}, function(err, results) {
        if (err) {
            return next({
                title: 'An error occurred',
                error: err
            });
        }

        if (!results) {
            return next({
                title: 'No stocks found',
                error: { message: 'Could not find any stocks' }
            });
        }

        res.status(200).json({
            message: 'Stocks retrieved',
            obj: results
        });
    });
});

router.post('/', function(req, res, next) {

});

module.exports = router;