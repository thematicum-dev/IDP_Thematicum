var RegistrationAccessCode = require('../models/accessCode');
var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');

exports.listAccessCodes = function (req, res, next) {
    let timeInMillis = new Date().getTime();
    RegistrationAccessCode.find({validFrom: {'$lte': timeInMillis}, validUntil: {'$gte': timeInMillis}}, function(err, results) {
        if (err) {
            return next(err);
        }

        if (!results) {
            return next(new AppError('No valid access codes', 404));
        }

        res.status(200).json(new AppResponse('Access codes retrieved', results));
    });
}