import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function listAccessCodes(req, res, next) {
    repo.getValidAccessCodes()
        .then(results => {
            if (!results) {
                return next(new AppError('No valid access codes', 404));
            }

            return res.status(200).json(new AppResponse('Access codes retrieved', results));
        })
        .catch(err => next(err));
}