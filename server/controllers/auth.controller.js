var RegistrationAccessCode = require('../models/accessCode');
var AppError = require('../utilities/appError');
var AppAuthError = require('../utilities/appAuthError');
var AppResponse = require('../utilities/appResponse');
var User = require('../models/user');
var authUtilities = require('../utilities/authUtilities');

exports.signup = function (req, res, next) {
    //check accessCode validity
    isAccessCodeValid(req.body.accessCode, req.body.currentTime, function(err, results) {
        if (err) {
            return next(err);
        }

        if(!results) {
            return next(new AppError('Invalid Access Code', 500));
        }

        //check for password length
        if (req.body.user.password.length < 8) {
            return next(new AppError('Validation error: password must be no shorter than 8 characters', 500));
        }

        //encrypt password
        var user = new User({
            name: req.body.user.name,
            email: req.body.user.email,
            password: req.body.user.password,
            personalRole: req.body.user.personalRole
        });

        user.save(function(err, result) {
            if (err) {
                return next(err);
            }

            res.status(201).json(new AppResponse('User created', null));
        });
    });
}

exports.signin = function (req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return next(err);
        }

        if(!user) {
            return next(new AppError('Invalid login credentials', 401));
        }

        //check password
        if (!user.passwordIsValid(req.body.password)) {
            return next(new AppError('Invalid login credentials', 401));
        }

        var token = authUtilities.jwtSign({user: user});
        res.status(200).json({
            message: 'Successful login',
            token: token,
            username: user.name
        });
    });
}

exports.isAuthenticated = function (req, res, next) {
    authUtilities.jwtVerify(req.query.token)
        .then(decoded => {
            return res.status(200).json(new AppResponse('User is authenticated', null));
        })
        .catch(err => {
            return next(new AppAuthError(err.name, 401));
        });
}

function isAccessCodeValid(code, currentTime, callback) {
    RegistrationAccessCode.findOne({code: code, validFrom: {'$lte': currentTime}, validUntil: {'$gte': currentTime}}, function(err, results) {
        let accessCode = !!results;
        callback(err, accessCode);
    });
}