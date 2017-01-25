var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var mongoose = require('mongoose');
var userInputAggregation = require('../utilities/userInputAggregation');
var _ = require('underscore');
var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');
var constants = require('../utilities/constants');

exports.listByTheme = function(req, res, next) {
    //get theme properties aggregation
    UserThemeInput.find({theme: req.theme._id}, function(err, results) {
        if (err) {
            return next(err);
        }

        if (!results) {
            return next(new AppError('No theme property found for the theme', 404));
        }

        var props = [{
            propertyName: 'timeHorizon',
            nrValuesRequired: constants.TOTAL_TIME_HORIZON_VALUES
        }, {
            propertyName: 'maturity',
            nrValuesRequired: constants.TOTAL_MATURITY_VALUES
        }, {
            propertyName: 'categories',
            nrValuesRequired: constants.TOTAL_CATEGORY_VALUES
        }];

        var themeProperties = userInputAggregation.getThemePropertiesAggregation(results, props);

        return res.status(200).json(new AppResponse('Theme properties retrieved', {properties: themeProperties}));
    });
}

exports.create = function(req, res, next) {
    //TODO: createOrUpdate - check in frontend?
    //new UserThemeInput
    var themeProperty = new UserThemeInput({
        user: res.locals.user,
        theme: req.theme,
        themeProperties: {
            timeHorizon: req.body.timeHorizon,
            maturity: req.body.maturity,
            categories: req.body.categories
        }
    });

    themeProperty.save(function(err, result) {
        if(err) {
            return next(err);
        }

        return res.status(201).json(new AppResponse('Theme property created', result));
    });
}

exports.listByThemeAndUser = function(req, res, next) {
    UserThemeInput.findOne({theme: req.theme._id, user: res.locals.user._id}, function(err, results) {
        if (err) {
            return next(err);
        }

        if(!results) {
            return next(new AppError('No theme property from the user', 404));
        }

        return res.status(200).json(new AppResponse('User theme properties retrieved', results));
    });
}

exports.update = function(req, res, next) {
    var themeProperty = req.themeProperty;

    if (req.body.timeHorizon)
        themeProperty.themeProperties.timeHorizon = req.body.timeHorizon;
    if (req.body.maturity)
        themeProperty.themeProperties.maturity = req.body.maturity;
    if (req.body.categories)
        themeProperty.themeProperties.categories = req.body.categories;

    themeProperty.save(function(err, result) {
        if (err) {
            return next(err);
        }

        return res.status(201).json({
            message: 'Theme property updated',
            obj: result
        });

    });
}

exports.delete = function(req, res, next) {
    var themeProperty = req.themeProperty;

    themeProperty.remove(function(err) {
        if(err) {
            return next(err);
        }

        return res.status(200).json({
            message: 'Theme property deleted'
        });
    });
}

//TODO: extract this separately
exports.themeById = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid Object Id', 400));
    }

    Theme.findById(id).populate('creator', 'name personalRole')
        .exec(function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result) {
                return next(new AppError('No theme found for the given Id', 404));
            }

            req.theme = result;
            next();
        });
}

exports.themePropertyById = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid Object Id', 400));
    }

    UserThemeInput.findById(id)
        .populate('user', '_id')
        .exec(function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result) {
                return next(new AppError('No theme property found for the given Id', 404));
            }

            //TODO: (maybe refactor) check authorization
            if (res.locals.user && result.user._id.equals(res.locals.user._id)) {
                req.themeProperty = result;
                return next();
            }

            return next(new AppError('Not authorized', 403));
        });
}