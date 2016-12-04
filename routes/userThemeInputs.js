var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var constants = require('../models/constants');

router.get('/', function(req, res, next) {
    return res.status(200).json({
        message: 'get user inputs'
    })
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

        //save new UserThemeInput
        var userInput = new UserThemeInput({
            theme: theme,
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
                message: 'User input created',
                obj: userInput
            });
        });
    });
});

module.exports = router;