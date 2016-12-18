var express = require('express');
var router = express.Router();
var Stock = require('../models/stock');

router.get('/', function(req, res, next) {
    Stock.find({}, function(err, results) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        if (!results) {
            return res.status(500).json({
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

module.exports = router;