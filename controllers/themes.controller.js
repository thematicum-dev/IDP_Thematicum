var Theme = require('../models/theme');
var mongoose = require('mongoose');
var _ = require('underscore');

exports.createMany = function(req, res, next) {
    //var article = new Article(req.body);
    var theme = new Theme({
        name: req.body.theme.name,
        tags: req.body.theme.tags,
        description: req.body.theme.description,
        creator: res.locals.user
    });
    //TODO: how to store authenticated user: req.user or res.locals.user

    theme.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.status(201).json({
            message: 'Theme created',
            obj: theme
        });
    });
}

exports.read = function(req, res, next) {
    // convert mongoose document to JSON
    var theme = req.theme ? req.theme.toJSON() : {};
    return res.status(200).json({
        message: 'Theme retrieved',
        obj: theme
    });
}

exports.update = function(req, res, next) {
    var theme = req.theme;

    if (req.body.name)
        theme.name = req.body.name;
    if (req.body.description)
        theme.description = req.body.description;
    //TODO: allow empty tags or not?
    if (req.body.tags)
        theme.tags = req.body.tags;

    theme.save(function(err, result) {
        if (err) {
            return next(err);
        }

        return res.status(201).json({
            message: 'Theme updated',
            obj: result
        });

    });
}

exports.delete = function(req, res, next) {
    //TODO: implement
}

exports.getTags = function(req, res, next) {
    Theme.find({tags: { $ne: null }}, {'tags': 1, '_id': 0}, function(err, results) {
        if (err) {
            return next(err);
        }

        var tags = new Set();
        if (results) {
            _.each(results, function (themeTags) {
                _.each(themeTags.tags, function (tag) {
                    tags.add(tag)
                });
            });
        }

        return res.status(200).json({
            message: 'Theme tags retrieved',
            obj: Array.from(tags)
        });
    });
}

exports.list = function(req, res, next) {
    //TODO: sorting?
    if(req.query.searchQuery) {
        Theme.find(
            {$text: {$search: req.query.searchQuery}},
            {score: {$meta: 'textScore'}})
            .sort({score: {$meta: "textScore"}})
            .exec(function (err, results) {
                if (err) {
                    return next(err);
                }

                //TODO: if no matching theme is found, the result is [], i.e. not null
                if (!results) {
                    return res.status(404).send({
                        message: 'No themes found for the search query'
                    });
                }

                return res.status(200).json({
                    message: 'Investment themes retrieved',
                    obj: results
                });
            });
    } else {
        Theme.find(function(err, results) {
            if(err) {
                return next(err);
            }

            return res.status(200).json({
                message: 'Investment themes retrieved',
                obj: results
            });
        });
    }
}

exports.themeById = function (req, res, next, id) {
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
};