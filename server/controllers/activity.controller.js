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
    let lowerLimit = Number(req.query.from);
    let upperLimit = Number(req.query.to);
    repo.getNewsFeedByUserWithLimits(user, lowerLimit, upperLimit)
        .then(results => {
            if (!results) {
                return next(new AppError('No activity found, please provide some theme input to find activity', 404));
            }

            if (res.locals.user){
                for(var i = 0 ; i < results.length ; i++){
                    if(results[i].user == res.locals.user._id){
                        results[i].userName = "You";
                    }
                }
            }

            return res.status(200).json(results);
        })
        .catch(err => next(err));
}

export function getActivityByThemesOfAUser(req, res, next){
    let user = req.user;
    let lowerLimit = Number(req.query.from);
    let upperLimit = Number(req.query.to);
    repo.getNewsFeedByThemesAUserFollowsWithLimits(user,lowerLimit,upperLimit).then(results=>{
        if (!results) {
                return next(new AppError('No activity found, please provide some theme input to find activity', 404));
            }

        if (res.locals.user){
                for(var i = 0 ; i < results.length ; i++){
                    if(results[i].user == res.locals.user._id){
                        results[i].userName = "You";
                    }
                }
        }

        return res.status(200).json(results);
    }).catch(err => next(err));
}

export function getActivityByAdminBetweenTimeAndLimits(req, res, next){
    let user = req.user;
    let lowerLimit = Number(req.query.from);
    let upperLimit = Number(req.query.to);
    let lowerTimeLimit = null;
    if (req.query.fromTime == undefined){
        lowerTimeLimit = Date.parse("1900-07-29T12:25:16.783Z")
    }else{
        lowerTimeLimit = new Date(Number(req.query.fromTime)).toISOString();
    }

    let upperTimeLimit = null;
    if (req.query.toTime == undefined){
        upperTimeLimit = new Date().toISOString();
    }else{
        upperTimeLimit = new Date(Number(req.query.toTime)).toISOString();
    }
    
    
    
    repo.getNewsFeedByAdminUserBetweenDatesWithLimits(lowerTimeLimit, upperTimeLimit, lowerLimit, upperLimit).then(results=>{
        if (!user.isAdmin){
            return next(new AppError('The user is not admin, cannot get activity data', 404));
        }
        else if (!results) {
                return next(new AppError('No activity found, please provide some theme input to find activity', 404));
        }        

        return res.status(200).json(results);
    }).catch(err => next(err));

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

export function getThemesAUserFollows(req, res, next) {
    let user = req.user;
    repo.getThemesAUserFollows(user)
        .then(results => {
            if (!results) {
                return next(new AppError('No Theme Found, please follow some theme to get the results here', 404));
            }

            return res.status(200).json(results);
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

export function sendSubscriptionEmail(req, res, next) {
    console.log("eta kina aena00");
    return res.status(400).json(new AppResponse('Access denied ', null));
}

