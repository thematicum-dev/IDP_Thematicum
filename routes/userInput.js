var express = require('express');
var router = express.Router();

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