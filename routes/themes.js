var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var ThemePropertyInput = require('../models/themePropertyInput');
var User = require('../models/user');
var constants = require('../models/constants');

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

router.get('/', function(req, res, next) {
    Theme.find(function(err, results) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
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
});

router.get('/:query', function (req, res, next) {
    Theme.find(
        {$text: {$search: req.params.query}},
        {score: {$meta: 'textScore'}})
        .sort({score: {$meta: "textScore"}})
        .exec(function (err, results) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            if (!results) {
                return res.status(500).json({
                    title: 'No investment themes found',
                    error: {message: 'Could not find any investment theme'}
                });
            }

            res.status(200).json({
                message: 'Investment themes retrieved',
                obj: results
            });
        });
});

router.post('/', function (req, res, next) {
    //create new Theme
    var theme = new Theme({
        name: req.body.theme.name,
        tags: req.body.theme.tags,
        description: req.body.theme.description
    });

    console.log(req.body.theme.name + ", " + req.body.theme.tags + ", " + req.body.theme.description)
    console.log('At node:')
    console.log(theme)

    theme.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred at saving theme',
                error: err
            });
        }

        //create user interaction
        var decoded = jwt.decode(req.query.token);
        //find user
        User.findById(decoded.user._id, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            //save user interaction
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

                //TODO: which object to return?
                res.status(201).json({
                    message: 'Theme created',
                    obj: result
                });
            });
        });
    });
});


module.exports = router;
