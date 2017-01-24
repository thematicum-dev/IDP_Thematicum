var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var mongoose = require('mongoose');
var userInputAggregation = require('../utilities/userInputAggregation');
var _ = require('underscore');

exports.listByTheme = function(req, res, next) {
    //get theme properties aggregation
    UserThemeInput.find({theme: req.theme._id}, function(err, results) {
        if (err) {
            return next(err);
        }

        if (!results) {
            return res.status(404).send({
                message: 'No theme property found for the theme'
            });
        }

        var props = [{
            propertyName: 'timeHorizon',
            nrValuesRequired: 3
        }, {
            propertyName: 'maturity',
            nrValuesRequired: 5
        }, {
            propertyName: 'categories',
            nrValuesRequired: 6
        }];

        var themeProperties = userInputAggregation.getThemePropertiesAggregation(results, props);

        return res.status(200).send({
            message: 'Theme properties retrieved',
            obj: {properties: themeProperties}
        });
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

        return res.status(201).json({
            message: 'Theme property created',
            obj: result
        });
    });
}

exports.listByThemeAndUser = function(req, res, next) {
    UserThemeInput.findOne({theme: req.theme._id, user: res.locals.user._id}, function(err, results) {
        if (err) {
            return next(err);
        }

        if(!results) {
            return res.status(404).send({
                message: 'No theme property from the user'
            });
        }

        console.log('user inputs', results)

        return res.status(200).send({
            message: 'User theme properties retrieved',
            obj: results
        });
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
        return next({
            title: 'Mongoose Invalid Object Id',
            error: {message: 'Invalid Object Id'},
            status: 400
        });
    }

    Theme.findById(id).populate('creator', 'name personalRole')
        .exec(function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result) {
                return res.status(404).send({
                    message: 'No theme found for the given Id'
                });
            }

            req.theme = result;
            next();
        });
}

exports.themePropertyById = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next({
            title: 'Mongoose Invalid Object Id',
            error: {message: 'Invalid Object Id'},
            status: 400
        });
    }

    UserThemeInput.findById(id)
        .populate('user', '_id')
        .exec(function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result) {
                return res.status(404).send({
                    message: 'No theme property found for the given Id'
                });
            }

            //TODO: (maybe refactor) check authorization
            if (res.locals.user && result.user._id.equals(res.locals.user._id)) {
                req.themeProperty = result;
                return next();
            }

            return res.status(403).send({
                message: 'Not authorized'
            });
        });
}