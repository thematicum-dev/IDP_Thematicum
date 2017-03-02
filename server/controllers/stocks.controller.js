var Stock = require('../models/stock');
var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');
import DataRepository from '../data_access/dataRepository';

let repo = new DataRepository();

exports.list = function (req, res, next) {
    repo.getAll(Stock)
        .then(results => {
            if(!results) {
                return next(new AppError('No stocks found', 404));
            }

            return res.status(200).json(new AppResponse('Stocks retrieved', results));
        })
        .catch(err => next(err));
}