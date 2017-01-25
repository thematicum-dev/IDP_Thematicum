var Stock = require('../models/stock');
var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');

exports.list = function (req, res, next) {
    Stock.find(function(err, results) {
        if(err) {
            return next(err);
        }

        if(!results) {
            return next(new AppError('No stocks found', 404));
        }

        return res.status(200).json(new AppResponse('Stocks retrieved', results));
    });
}