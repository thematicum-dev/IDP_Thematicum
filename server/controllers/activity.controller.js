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

export function getActivityByUser(req, res, next) {
    let user = req.user;
    let upperLimit = req.upperLimit;
    let lowerLimit = req.lowerLimit;
    repo.getNewsFeedByUserWithLimits(user, upperLimit, lowerLimit)
        .then(results => {
            if (!results) {
                return next(new AppError('No activity found, please provide some theme input to find activity', 404));
            }

            return res.status(200).json(results);
        })
        .catch(err => next(err));
}

export function deleteActivityByUser(req, res, next) {
    let user = req.user;
    repo.deleteActivityByUser(user.email)
        .then(results => {
            if (!results) {
                return next(new AppError('No activity found, please provide some theme input to find activity', 404));
            }

            return res.status(202).json(results);
        })
        .catch(err => next(err));
}


export function userByEmail(req, res, next, userEmail) {
    repo.getUserByEmail(userEmail)
        .then(result => {
            if (!result) {
                return next(new AppError('No user found for the given email', 404))
            }

            req.user = result;
            next();
        })
        .catch(err => next(err));
}