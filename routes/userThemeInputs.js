var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var constants = require('../models/constants');
var jwt = require('jsonwebtoken');
var authenticatedUser;

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

        var decoded = jwt.decode(req.query.token);
        User.findById(decoded.user._id, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            if (!user) {
                return res.status(500).json({
                    title: 'No user found',
                    error: {message: 'No user was found'}
                });
            }

            authenticatedUser = user;

            next();
        });
    });
});


router.get('/', function(req, res, next) {
    return res.status(200).json({
        message: 'get user inputs'
    })
});

router.put('/:id', function(req, res, next) {
    UserThemeInput.findById(req.params.id)
        .populate('user', '_id', { _id: authenticatedUser._id}, null)
        .exec(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            if(!result) {
                return res.status(500).json({
                    title: 'No user input found',
                    error: { message: 'No user input was found for this theme'}
                });
            }

            if (result.user == null) {
                return res.status(401).json({
                    title: 'Not authorized',
                    error: { message: 'Not authorized to modify this resource'}
                });
            }

            //update existing user input values
            //TODO: got updated to: themePropertiesAggregation
            if (req.body.timeHorizon)
                result.themePropertiesAggregation.timeHorizon = req.body.timeHorizon;
            if (req.body.maturity)
                result.themePropertiesAggregation.maturity = req.body.maturity;
            if (req.body.categories)
                result.themePropertiesAggregation.categories = req.body.categories;

            result.save(function(err, userInput) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                res.status(201).json({
                    message: 'User input updated',
                    obj: userInput
                });
            });

        });
});

router.post('/', function (req, res, next) {
    //get authenticated user
    console.log('finding theme: ' + req.query.themeId)
    //find theme
    Theme.findById(req.query.themeId, function(err, theme) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        if (!theme) {
            return res.status(500).json({
                title: 'No theme found',
                error: {message: "No theme found"}
            });
        }

        //save new UserThemeInput
        var userInput = new UserThemeInput({
            user: authenticatedUser,
            theme: theme,
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

            return res.status(201).json({
                message: 'User input created',
                obj: userInput
            });
        });
    });
});

module.exports = router;