var express = require('express');
var router = express.Router();
var Theme = require('../models/theme');

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
    searchTerm = req.params.query;
        Theme.find(
            {$text: {$search: searchTerm}},
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
        name: req.body.name,
        tagsAndRelatedThemes: req.body.tagsAndRelatedThemes,
        description: req.body.description,
        timeHorizon: req.body.timeHorizon,
        maturity: req.body.maturity,
        categories: req.body.categories
    });

    theme.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        res.status(201).json({
            message: 'Theme created',
            obj: result
        });
    });
});


module.exports = router;
