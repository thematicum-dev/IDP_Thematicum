import Stock from '../models/stock';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function list(req, res, next) {
    repo.getAll(Stock)
        .then(results => {
            if(!results) {
                return next(new AppError('No stocks found', 404));
            }

            return res.status(200).json(new AppResponse('Stocks retrieved', results));
        })
        .catch(err => next(err));
}