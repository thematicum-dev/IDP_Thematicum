var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var RegistrationAccessCode = require('../models/accessCode');
var AppError = require('../utilities/appError');
var AppAuthError = require('../utilities/appAuthError');
var AppResponse = require('../utilities/appResponse');
var User = require('../models/user');

//TODO: abstract data in settings
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
            password: bcrypt.hashSync(String(req.body.user.password), 10),
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
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return next(new AppError('Invalid login credentials', 401));
        }

        //valid login credentials (valid for 7200sec = 2hr)
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 120});
        res.status(200).json({
            message: 'Successful login',
            token: token,
            userId: user._id,
            username: user.name
        });
    });
}

exports.isAuthenticated = function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return next(new AppAuthError(err.name, 401));
        }

        return res.status(200).json(new AppResponse('User is authenticated', null));
    });
}

function isAccessCodeValid(code, currentTime, callback) {
    RegistrationAccessCode.findOne({code: code, validFrom: {'$lte': currentTime}, validUntil: {'$gte': currentTime}}, function(err, results) {
        let accessCode = !!results;
        callback(err, accessCode);
    });
}