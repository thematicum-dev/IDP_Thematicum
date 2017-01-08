var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var constants = require('../models/constants');
var jwt = require('jsonwebtoken');
var authenticatedUser; //TODO: remove
var repository = require('../data_access/dataRepository');
var authUtilities = require('../utilities/authUtilities');

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.put('/:id', function(req, res, next) {
    repository.updateUserInput(req.params.id, res.locals.user, req.body, function(err, result) {
        if(err) {
            next(err);
        }

        return res.status(200).json({
            message: 'User input updated',
            obj: result
        });
    });
});

router.post('/', function (req, res, next) {
    repository.addUserInput(req.query.themeId, res.locals.user, req.body, function(err, result) {
        if (err) {
            next(err)
        }

        return res.status(201).json({
            message: 'User input created',
            obj: result
        });

    });
});

module.exports = router;