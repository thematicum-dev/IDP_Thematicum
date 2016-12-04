var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var User = require('../models/user');
var constants = require('../models/constants');
var _ = require('underscore');
var userInputAggregation = require('../utilities/userInputAggregation');

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

router.get('/details/:id', function(req, res, next) {
    UserThemeInput.find({theme: req.params.id}, function(err, results) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        if (!results) {
            return res.status(500).json({
                title: 'No investment theme found',
                error: {message: 'Could not find any investment theme for the given id'}
            });
        }

        //TODO: further work, figure out aggregation function
        //userInput.themePropertyInputs returns everyting
        //[0] for timeHorizon
        //[1] for maturity
        //[2] for categories
        z = _.flatten(_.map(results, function(userInput) {
                return userInput.themePropertyInputs
            }));

        //z = _.flatten(x)

        test = _.chain(results)
            .map(function(userInput) { return userInput.themePropertyInputs; })
            .flatten()
            .groupBy('property')
            .value();

        x = _.chain(test.categories)
            .map(function(prop) {
                return prop.valueChosen
            })
            .flatten()
            .countBy()
            .value();

        sum = _.reduce(x, function(memo, num){ return memo + num; }, 0); //IT WORKS!!!

        x = _.map(x, function(val, key) {
            val = { value: key, count: val, percentage: userInputAggregation.roundUp(100*val/sum, 10) }
            console.log(val)
            return val;
        })

        // x = _.map(x, function(key) {
        //     key = { count: key, percentage: key/sum }
        //     console.log(key)
        //     return key;
        // })





        //need to return
        toReturn = { values: x, total: sum}




        count = _.countBy([1, 2, 3, 4, 5, 1, 2, 4], function(num) {
            return num;
        });
        //this returns:
        //"1": 2,
        //"2": 2,
        //"3": 1 and so on

        /*
        returns {
            "timeHorizon": [], //x items
            "maturity": [], //y items
            "categories": [] //z items
        }
         */

        // .reduce(function(counts, word) {
        //     counts[word] = (counts[word] || 0) + 1;
        //     return counts;
        // }, {})

        //console.log(z)
        another = _.groupBy(z, 'property')
        //console.log('another')
        //console.log(another)

        //for timeHorizon
        timeHorizons = another.timeHorizon
        maturities = another.maturity
        categories = another.categories

        //var count = _.reduce(x, function(memo, num){ return memo + 1; }, 0);

        //need to return: _.groupBy(another.timeHorizon, 'valueChosen')
        aggCat = _.map(another.categories, function(cat) {
            return cat.valueChosen;
        })

        aggCatFlattened = _.flatten(aggCat).map(function(x) {
            return { value: x, count: 1}
        });

        //_.groupBy(aggCatFlattened, 'value')
        return res.status(200).json({
            message: 'User inputs retrieved',
            obj: x
        });

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

                return res.status(200).json({
                    message: 'Investment theme retrieved',
                    obj: theme
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
                themePropertyInputs: [
                    {
                        property: constants.THEME_PROPERTY_TIME_HORIZON,
                        valueChosen: req.body.timeHorizon
                    },
                    {
                        property: constants.THEME_PROPERTY_MATURITY,
                        valueChosen: req.body.maturity
                    },
                    {
                        property: constants.THEME_PROPERTY_CATEGORY,
                        valueChosen: req.body.categories
                    },
                ],
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
