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

        themePropertyData = userInputAggregation.getThemePropertyData(results);

        return res.status(200).json({
            message: 'User inputs retrieved',
            obj: themePropertyData
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


function aggregate() {

}
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

                //TEST - say these are the user inputs found for this theme
                var test = [];
                test.push({
                    themeProperties: {
                        "timeHorizon": 1,
                        "maturity": 2,
                        "categories": [1, 3]
                    }
                });

                test.push({
                    themeProperties: {
                        "timeHorizon": 1,
                        "maturity": 3,
                        "categories": [1, 2, 3]
                    }
                });

                test.push({
                    themeProperties: {
                        "timeHorizon": 2,
                        "maturity": 3,
                        "categories": [1, 4, 3]
                    }
                });

                // console.log(test)
                // _.each(test, function(testEl) {
                //     _.each(testEl.themeProperties, function(val, key) {
                //         console.log(key) //this is value actually
                //         console.log(val)
                //     });
                // });

                // var y = _.chain(test)
                //     .map(function(input) { return test.themeProperties})
                //     .each(function(value, key) {
                //         //function call
                //         console.log(key)
                //         console.log(value)
                //     });

                //yeah
                // _.chain(test)
                //     .map(function(testEl) {
                //     return testEl.themeProperties;
                //     }).each(function(val, key) {
                //         console.log(key) //this is value actually
                //         console.log(val)
                //     });

                //works good and can specify the property explicitly
                zzz = _.chain(test)
                    .map(function(testEl) {
                        return testEl.themeProperties;
                    })
                    .flatten()
                    .countBy('timeHorizon')
                    .value();

                console.log(zzz);

                cat = "categories";
                var x = _.chain(test)
                    .map(function(input) { return input.themeProperties.categories})
                    .flatten()
                    .countBy()
                    .value();
                console.log('Distribution')
                console.log(x)

                //AWESOME!
                console.log('Sum')
                sum = _.reduce(x, function(memo, num){ return memo + num; }, 0); //sum up votes
                console.log(sum)

                //good
                aggregationData = _.map(x, function(val, key) {
                    val = { value: key, count: val, percentage: userInputAggregation.roundUp(100*val/sum, 10) }
                    return val;
                });

                //retrieve the embedded doc of themeProperties
                toTest = _.chain(test)
                    .map(function(testEl) {
                        return testEl.themeProperties;
                    }).value();

                console.log('TESTING NEW FUNCTION')
                countByProp = userInputAggregation.getCountByProperty(toTest, 'timeHorizon')
                sumByProp = userInputAggregation.getSumByProperty(countByProp)
                aggregationByProp = userInputAggregation.getAggregationByProperty(countByProp, sumByProp)
                console.log(countByProp)
                console.log(sumByProp)
                console.log(aggregationByProp)

                console.log('Agg. data')
                console.log(aggregationData)


                

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

                    themePropertyData = userInputAggregation.getThemePropertyData(results);

                    return res.status(200).json({
                        message: 'Theme properties retrieved',
                        obj: { theme: theme, properties: themePropertyData }
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
