var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');
import DataRepository from '../data_access/dataRepository';

let repo = new DataRepository();

exports.listAccessCodes = function (req, res, next) {
    repo.getValidAccessCodes()
        .then(results => {
            if (!results) {
                return next(new AppError('No valid access codes', 404));
            }

            return res.status(200).json(new AppResponse('Access codes retrieved', results));
        })
        .catch(err => next(err));
}