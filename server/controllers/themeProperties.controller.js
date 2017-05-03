import UserThemeInput from '../models/userThemeInput';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function listByThemeId(req, res, next) {
    repo.getThemePropertiesByThemeId(req.theme._id, res.locals.user._id)
        .then(results => {
            if (!results) {
                return next(new AppError('No theme property found for the theme', 404));
            }

            return res.status(200).json(new AppResponse('Theme properties retrieved', results));
        })
        .catch(err => next(err));
}

export function create(req, res, next) {
    //TODO: createOrUpdate - check in frontend?
    const themeProperty = new UserThemeInput({
        user: res.locals.user,
        theme: req.theme,
        timeHorizon: req.body.timeHorizon,
        maturity: req.body.maturity,
        categories: req.body.categories
    });

    repo.save(themeProperty)
        .then(result => res.status(201).json(new AppResponse('Theme property created', result)))
        .catch(err => next(err));
}

export function update(req, res, next) {
    let themeProperty = req.themeProperty;

    if (req.body.timeHorizon != null)
        themeProperty.timeHorizon = req.body.timeHorizon;
    if (req.body.maturity != null)
        themeProperty.maturity = req.body.maturity;
    if (req.body.categories != null)
        themeProperty.categories = req.body.categories;

    repo.save(themeProperty)
        .then(result => res.status(201).json(new AppResponse('Theme property updated', result)))
        .catch(err => next(err));
}

export function deleteThemeProperty(req, res, next) {
    repo.remove(req.themeProperty)
        .then((result) => res.status(200).json({
            message: 'Theme property deleted'
        }))
        .catch(err => next(err));
}

export function themeById(req, res, next, id) {
    repo.getThemeById(id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme found for the given Id', 404))
            }

            req.theme = result;
            next();
        })
        .catch(err => next(err));
}

export function themePropertyById(req, res, next, id) {
    repo.getThemePropertyById(id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme property found for the given Id', 404));
            }

            //TODO: (maybe refactor) check authorization
            if (res.locals.user && result.user._id.equals(res.locals.user._id)) {
                req.themeProperty = result;
                return next();
            }

            return next(new AppError('Not authorized', 403));
        })
        .catch(err => next(err));
}