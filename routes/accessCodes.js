var express = require('express');
var router = express.Router();
var RegistrationAccessCode = require('../models/accessCode');

//http://localhost:3000/api
router.get('/', function(req, res, next) {
    timeInMillis = new Date().getTime();
    RegistrationAccessCode.find({validFrom: {'$lte': timeInMillis}, validUntil: {'$gte': timeInMillis}}, function(err, results) {
        if (err) {
            return next({
                title: 'An error occurred',
                error: err
            });
        }

        if (!results) {
            return next({
                title: 'No access codes',
                error: { message: 'Could not find valid access codes' }
            });
        }

        res.status(200).json({
            message: 'Access codes retrieved',
            obj: results
        });
    });
});

module.exports = router;