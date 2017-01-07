var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var User = require('../models/user');
var Stock = require('../models/stock');
var constants = require('../models/constants');
var _ = require('underscore');
var userInputAggregation = require('../utilities/userInputAggregation');
var ObjectId = require("mongodb").ObjectID;
var repository = require("../data_access/dataRepository");

router.get('/tags', function(req, res, next) {
    repository.getAllThemeTags(Theme, function(err, results) {
        if(err) {
            next(err);
        }

        return res.status(200).json({
            message: 'Theme tags retrieved',
            obj: Array.from(results)
        });
    });
});

//middleware - protected routes from now on
router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if(err) {
            //invalid token
            return next({
                title: 'Not Authenticated',
                error: err,
                status: 401
            });
        }

        next();
    });
});

router.get('/userinputs/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(err, user) {
        if (err) {
            return next({
                title: 'An error occurred',
                error: err
            });
        }

        //TODO: if not

        Theme.findById(req.params.id, function(err, theme) {
            if (err) {
                return next({
                    title: 'An error occurred',
                    error: err
                });
            }

            if (!theme) {
                return next({
                    title: 'No theme found',
                    error: {message: 'Could not find any investment theme for the given id'},
                    status: 404
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
                        return next({
                            title: 'An error occurred',
                            error: err
                        });
                    }

                    if(!inputs) {
                        return next({
                            message: 'No user inputs were found',
                            status: 404
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
    repository.getThemeById(Theme, req.params.id, function(err, theme) {
        if (err) {
            next(err)
        }

        //get theme properties
        UserThemeInput.find({theme: theme._id}, function(err, results) {
            if (err) {
                return next({
                    title: 'An error occurred',
                    error: err
                });
            }

            if (!results) {
                return next({
                    title: 'No theme properties found',
                    error: {message: 'Could not find any user input for the given theme'},
                    status: 404
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
});

router.get('/', function(req, res, nex) {
    if(req.query.searchQuery) {
        repository.getThemeByTextSearch(Theme, req.query.searchQuery, function(err, results) {
            if (err) {
                next(err)
            }
            return res.status(200).json({
                message: 'Investment themes retrieved',
                obj: results
            });
        });
    } else {
        repository.getAll(Theme, function(err, allThemes) {
            if(err) {
                next(err)
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
            return next({
                title: 'An error occurred',
                error: err
            });
        }

        if (!user) {
            return next({
                title: 'No user found',
                error: { message: 'No user for the given token was found'}
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
                return next({
                    title: 'An error occurred at saving theme',
                    error: err
                });
            }

            //save new UserThemeInput
            var userInput = new UserThemeInput({
                user: user,
                theme: result,
                themeProperties: {
                    timeHorizon: req.body.themeProperties.timeHorizon,
                    maturity: req.body.themeProperties.maturity,
                    categories: req.body.themeProperties.categories
                }
            });

            userInput.save(function(err, userInput) {
                if (err) {
                    return next({
                        title: 'An error occurred',
                        error: err
                    });
                }


                //TODO: find stock by id
                getStockAllocation(req.body.stockAllocation, function(allocatedStocks) {
                    console.log('Getting stock allocation:')
                    console.log(allocatedStocks)

                    var userStockAllocation = new UserThemeStockAllocation({
                        user: user,
                        theme: result,
                        stockAllocation: allocatedStocks
                    });

                    userStockAllocation.save(function(err, userStockAllocation) {
                        if (err) {
                            return next({
                                title: 'An error occurred',
                                error: err
                            });
                        }

                        return res.status(201).json({
                            message: 'Theme created',
                            obj: [ result, userInput, userStockAllocation ]
                        });
                    });
                });
            });
        });
    });
});

//pass as parameter: req.body.stockAllocation
function getStockAllocation(stockAllocationData, callback) {
    var allocatedStocks = [];
    for (var i=0; i<stockAllocationData.length; i++) {
        var stockId = stockAllocationData[i].stockId;
        var exposure = stockAllocationData[i].exposure;

        findStockById(stockId, exposure, i, function(iter, result) {
            allocatedStocks.push(result);

            if (iter == stockAllocationData.length - 1) {
                callback(allocatedStocks);
            }
        })
    }
}

function findStockById(stockId, exposure, iter, callback) {
    Stock.findById(stockId, function(err, result) {
        if (err) {
            console.log(err)
            return
        }

        var stockAlloc = {stock: result, exposure: exposure};
        callback(iter, stockAlloc)
    })
}


module.exports = router;
