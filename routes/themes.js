var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var User = require('../models/user');
var constants = require('../models/constants');
var _ = require('underscore');
var userInputAggregation = require('../utilities/userInputAggregation');
var ObjectId = require("mongodb").ObjectID;

router.get('/tags', function(req, res, next) {
    //retrieve only tags from themes
    Theme.find({tags: { $ne: null }}, {'tags': 1, '_id': 0}, function(err, results) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        if (!results) {
            return res.status(500).json({
                title: 'No tags found',
                error: {message: 'Could not find any tags'}
            });
        } else {
            var tags = new Set();
            _.each(results, function(themeTags) {
                _.each(themeTags.tags, function(tag) {
                    tags.add(tag)
                });
            });

            return res.status(200).json({
                message: 'Theme tags retrieved',
                obj: Array.from(tags)
            });
        }
    });
});

//middleware - protected routes from now on
router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if(err) {
            //invalid token
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }

        next();
    });
});

router.get('/userinputs/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        Theme.findById(req.params.id, function(err, theme) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            /*
                Note: { _id: theme._id} clause doesn't filter documents
                It simply populates those for which the match holds, leaving others non-populated (i.e. null valued)
                Thus, need to filter results
             */
            UserThemeInput.find({})
                .populate('theme', '_id', { _id: theme._id}, null)
                .populate('user', '_id', { _id: user._id}, null)
                .exec(function(err, inputs) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }

                    if(!inputs) {
                        return res.status(500).json({
                            message: 'No user inputs were found'
                        });
                    }

                    var nonNullEntries = _.filter(inputs, function(input) {
                        return input.theme != null && input.user != null;
                    });

                    if(nonNullEntries != undefined && nonNullEntries.length > 0) {
                        //return first element
                        return res.status(200).json({
                            message: 'User inputs for the given theme retrieved',
                            obj: { userInputs: nonNullEntries[0] }
                        });
                    }
                });

        });


    });
});

router.get('/:id', function(req, res, next) {
    if(req.params.id) {
        Theme
            .findById(req.params.id)
            .populate('creator')
            .exec(function (err, theme) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred at finding theme by id',
                        error: err
                    });
                }

                if (!theme) {
                    return res.status(500).json({
                        title: 'No investment theme found',
                        error: {message: 'Could not find any investment theme for the given id'}
                    });
                }

                //get theme properties
                UserThemeInput.find({theme: theme._id}, function(err, results) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }

                    if (!results) {
                        return res.status(500).json({
                            title: 'No theme properties found',
                            error: {message: 'Could not find any user input for the given theme'}
                        });
                    }

                    props = [{
                        propertyName: 'timeHorizon',
                        nrValuesRequired: 3
                    }, {
                        propertyName: 'maturity',
                        nrValuesRequired: 5
                    }, {
                        propertyName: 'categories',
                        nrValuesRequired: 6
                    }];

                    themeProperties = userInputAggregation.getThemePropertiesAggregation(results, props);
                    console.log('Theme properties')
                    console.log(themeProperties);

                    return res.status(200).json({
                        message: 'Theme properties retrieved',
                        obj: { theme: theme, properties: themeProperties }
                    });

                });
            });
    }
});

router.get('/', function(req, res, nex) {
    if(req.query.searchQuery) {
        Theme.find(
            {$text: {$search: req.query.searchQuery}},
            {score: {$meta: 'textScore'}})
            .sort({score: {$meta: "textScore"}})
            .exec(function (err, results) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred at theme text search',
                        error: err
                    });
                }

                if (!results) {
                    return res.status(500).json({
                        title: 'No investment themes found',
                        error: {message: 'Could not find any investment theme'}
                    });
                }

                return res.status(200).json({
                    message: 'Investment themes retrieved',
                    obj: results
                });
            });
    } else {
        Theme.find(function (err, allThemes) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred at getting all themes',
                    error: err
                });
            }

            if (!allThemes) {
                return res.status(500).json({
                    title: 'No investment themes found',
                    error: {message: 'Could not find any investment theme'}
                });
            }

            return res.status(200).json({
                message: 'Investment themes retrieved',
                obj: allThemes
            });
        });
    }
});

router.post('/', function (req, res, next) {
    //get authenticated user
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        //save new Theme
        var theme = new Theme({
            name: req.body.theme.name,
            tags: req.body.theme.tags,
            description: req.body.theme.description,
            creator: user
        });

        theme.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred at saving theme',
                    error: err
                });
            }

            //save new UserThemeInput
            var userInput = new UserThemeInput({
                user: user,
                theme: result,
                themeProperties: {
                    timeHorizon: req.body.timeHorizon,
                    maturity: req.body.maturity,
                    categories: req.body.categories
                },
                stocksAllocationInputs: []
            });

            userInput.save(function(err, userInput) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                res.status(201).json({
                    message: 'Theme created',
                    obj: [ result, userInput ]
                });
            });
        });
    });
});


module.exports = router;
