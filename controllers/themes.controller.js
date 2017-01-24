var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var ThemeStockComposition = require('../models/themeStockComposition');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = {
    create: create,
    read: read,
    update: update,
    deleteThemeData: deleteThemeData,
    getTags: getTags,
    list: list,
    themeById: themeById
}

function create(req, res, next) {
    var theme = new Theme({
        name: req.body.name,
        tags: req.body.tags,
        description: req.body.description,
        creator: res.locals.user
    });

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

function read(req, res, next) {
    // convert mongoose document to JSON
    var theme = req.theme ? req.theme.toJSON() : {};
    return res.status(200).json({
        message: 'Theme retrieved',
        obj: theme
    });
}

function update(req, res, next) {
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

function deleteThemeData(req, res, next) {
    //TODO: delete related theme data, when deleting a theme, or not?
    var theme = req.theme;

    let deleteThemePromise = deleteTheme(theme);
    let deleteUserThemeInputsPromise = deleteUserInputsForTheme(theme);
    let deleteStocksPromise = deleteStocks(theme);
    Promise.all([deleteThemePromise, deleteUserThemeInputsPromise, deleteStocksPromise])
        .then(result => {
            return res.status(200).json({
                message: 'Theme related data deleted',
                obj: result
            })
        })
        .catch(error => { next(error) });
}

function deleteTheme(theme) {
    return new Promise(function (resolve, reject) {
        theme.remove(function(err) {
            if(err) {
                reject(err);
            }

            resolve({message: 'Theme deleted'});
        });
    });
}

function deleteUserInputsForTheme(theme) {
    return new Promise(function (resolve, reject) {
        UserThemeInput.remove({theme: theme._id}, function(err) {
           if(err) {
               reject(err);
           }

           resolve({message: 'Theme inputs deleted'});
        });
    });
}

function deleteStocks(theme) {
    let findCompositionsPromise = new Promise(function (resolve, reject) {
        ThemeStockComposition.find({theme: theme._id}, function(err, compositions) {
            if(err) {
                reject(err);
            }

            resolve(compositions);
        });
    });

    return findCompositionsPromise
        .then(results => {
            results.forEach(result => {
                return deleteStockAllocationsForComposition(result);
            })
        });
}

function deleteStockAllocationsForComposition(composition) {
    return new Promise(function (resolve, reject) {
        //remove theme-stock composition
        composition.remove(function(err) {
            if(err) {
                reject(err);
            }
            //remove stock allocations for the given theme-stock composition
            UserThemeStockAllocation.remove({themeStockComposition: composition._id}, function(err, results) {
                if(err) {
                    reject(err);
                }

                resolve(results);
            });
        });
    });
}

function getTags(req, res, next) {
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

function list(req, res, next) {
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

function themeById(req, res, next, id) {
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