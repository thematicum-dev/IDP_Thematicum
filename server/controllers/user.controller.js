import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function read(req, res, next) {
    let userEmail = req.userEmail;
    repo.getUserByEmail(userEmail)
        .then(result => {
            return res.status(204).json(new AppResponse('Theme updated', result));
        })
        .catch(err => next(err));
}

export function update(req, res, next) {
    let userEmail = req.userEmail;
    var user;
    if (req.body.name)
        user.name = req.body.name;
    if (req.body.email)
        user.email = req.body.email;
    if (req.body.tags)
        user.password = req.body.password;

    repo.updateUserByEmail(userEmail, user)
        .then(result => {
            let updatedUser = result.toJSON();
            return res.status(204).json(new AppResponse('Theme updated', updatedUser));
        })
        .catch(err => next(err));
}

export function follow(req, res, next) {
    // not tested yet, can only test when UI is made
    let userId = repo.getUserByEmail(req.query.email)._id;
    let themeId = req.query.themeId;

    repo.getUserByEmail(req.body.email).then(
        user => {
            if (!user) {
                return next(new AppError('User not found', 404));
            }
            let userId = user._id;
            let themeId = req.body.themeId;
            repo.followTheme(userId, themeId)
                .then(results => {
                    if (!results) {
                        return next(new AppError('Theme not unfollowed', 404));
                    }

                     return res.status(201).json({isFollowing: true, results: results});
                })
            .catch(err => next(err));
            }
    ).catch(err => next(err));
}

export function unfollow(req, res, next) {
    // not tested yet, can only test when UI is made
    let userId = repo.getUserByEmail(req.query.email)._id;
    let themeId = req.query.themeId;

    repo.getUserByEmail(req.query.email).then(
        user => {
            if (!user) {
                return next(new AppError('User not found', 404));
            }
            let userId = user._id;
            let themeId = req.query.themeId;
            repo.unFollowTheme(userId, themeId)
                .then(results => {
                    if (!results) {
                        return next(new AppError('Theme not unfollowed', 404));
                    }

                     return res.status(202).json({isFollowing: false, results: results});
                })
            .catch(err => next(err));
            }
    ).catch(err => next(err));
}

export function getFollowStatus(req, res, next) {
    // not tested yet, can only test when UI is made
    
    repo.getUserByEmail(req.query.email).then(
        user => {
            if (!user) {
                return next(new AppError('User not found', 404));
            }
            let userId = user._id;
            let themeId = req.query.theme;
            repo.getFollowThemeStatus(userId, themeId)
                .then(results => {
                    return res.status(200).json({user: userId, theme: themeId, isFollowing: results});
                })
                .catch(err => next(err));
        }
    ).catch(err => next(err));
    
}