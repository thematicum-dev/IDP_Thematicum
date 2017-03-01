var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var mongoose = require('mongoose');
var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');
var constants = require('../utilities/constants');
import DataRepository from '../data_access/dataRepository';
import ThemePropertiesAggregation from '../utilities/userInputAggregation';

let repo = new DataRepository();

exports.listByTheme = function(req, res, next) {
    //get theme properties aggregation
    repo.getThemePropertiesByTheme(req.theme._id)
        .then(results => {
            if (!results) {
                return next(new AppError('No theme property found for the theme', 404));
            }

            let aggregation = new ThemePropertiesAggregation();
            var themeProperties = aggregation.getThemePropertiesAggregation(results);

            return res.status(200).json(new AppResponse('Theme properties retrieved', {properties: themeProperties}));
        })
        .catch(err => next(err));
}

exports.create = function(req, res, next) {
    //TODO: createOrUpdate - check in frontend?
    var themeProperty = new UserThemeInput({
        user: res.locals.user,
        theme: req.theme,
        themeProperties: {
            timeHorizon: req.body.timeHorizon,
            maturity: req.body.maturity,
            categories: req.body.categories
        }
    });

    repo.save(themeProperty)
        .then(result => res.status(201).json(new AppResponse('Theme property created', result)))
        .catch(err => next(err));
}

exports.listByThemeAndUser = function(req, res, next) {
    repo.getThemePropertyByThemeAndUser(req.theme._id, res.locals.user._id)
        .then(results => {
            if(!results) {
                return next(new AppError('No theme property from the user', 404));
            }

            return res.status(200).json(new AppResponse('User theme properties retrieved', results));
        })
        .catch(err => next(err));
}

exports.update = function(req, res, next) {
    var themeProperty = req.themeProperty;

    if (req.body.timeHorizon != null)
        themeProperty.themeProperties.timeHorizon = req.body.timeHorizon;
    if (req.body.maturity != null)
        themeProperty.themeProperties.maturity = req.body.maturity;
    if (req.body.categories != null)
        themeProperty.themeProperties.categories = req.body.categories;

    repo.save(themeProperty)
        .then(result => res.status(201).json(new AppResponse('Theme property updated', result)))
        .catch(err => next(err));
}

exports.delete = function(req, res, next) {
    repo.remove(req.themeProperty)
        .then((result) => res.status(200).json({
            message: 'Theme property deleted'
        }))
        .catch(err => next(err));
}

exports.themeById = function(req, res, next, id) {
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

exports.themePropertyById = function(req, res, next, id) {
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