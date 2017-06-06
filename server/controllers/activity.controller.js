import ActivityLog from '../models/activitylog';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function listAllByTime(req, res, next) {
    repo.getActivities()
        .then(results => {
            if (!results) {
                return next(new AppError('No activity found, please provide some theme input to find activity', 404));
            }

            return res.status(200).json(results);
        })
        .catch(err => next(err));
}