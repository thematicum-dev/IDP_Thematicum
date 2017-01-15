var express = require('express');
var router = express.Router();
var Theme = require('../models/theme');
var repository = require("../data_access/dataRepository");
var authUtilities = require("../utilities/authUtilities");

//auth middleware


router.use('/', authUtilities.authenticationMiddleware);

router.get('/tags', function(req, res, next) {
    repository.getAllThemeTags(Theme, function(err, results) {
        if(err) {
            return next(err);
        }

        return res.status(200).json({
            message: 'Theme tags retrieved',
            obj: results
        });
    });
});

router.get('/:id', function(req, res, next) {
    repository.getThemeById(Theme, req.params.id, res.locals.user, function(err, result) {
        if (err) {
            return next(err)
        }

        console.log('Theme Data')
        console.log(result)
        return res.status(200).json({
            message: 'Theme data retrieved',
            obj: result
        });
    });
});

router.get('/', function(req, res, nex) {
    if(req.query.searchQuery) {
        repository.getThemeByTextSearch(Theme, req.query.searchQuery, function(err, results) {
            if (err) {
                return next(err)
            }
            return res.status(200).json({
                message: 'Investment themes retrieved',
                obj: results
            });
        });
    } else {
        repository.getAll(Theme, function(err, allThemes) {
            if(err) {
                return next(err)
            }

            return res.status(200).json({
                message: 'Investment themes retrieved',
                obj: allThemes
            });
        });
    }
});

router.post('/', function (req, res, next) {
    repository.addTheme(res.locals.user, req.body, function(err, result) {
        if (err) {
            return next(err)
        }
        return res.status(201).json({
            message: 'Theme created',
            obj: result
        });
    });
});

module.exports = router;