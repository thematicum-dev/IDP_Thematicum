var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var accessCodeValidity = require('../utilities/isAccessCodeValid');
var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');

router.get('/isAuthenticated', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            //TODO: return custom error?
            let customError = err.name == 'TokenExpiredError' ? 'Your session expired. Please log in again.' :
                err.name == 'JsonWebTokenError' ? 'Invalid authentication token. Please log in.' :
                    'Authentication error';
            return next(new AppError(customError, 401));
        }

        //TODO: check for user?
        return res.status(200).json(new AppResponse('User is authenticated', null));
    });
});

//create a user
router.post('/', function (req, res, next) {
    //check accessCode validity
    accessCodeValidity.isAccessCodeValid(req.body.accessCode, req.body.currentTime, function(err, results) {
        if (err) {
            return next(err);
        }

        if(!results) {
            return next(new AppError('Invalid Access Code', 500));
        }

        //check here for password length, since it will be later encrypted
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
});

//sign in
router.post('/signin', function(req, res, next) {
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
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 10});
        res.status(200).json({
            message: 'Successful login',
            token: token,
            userId: user._id,
            username: user.name
        });
    });
})

module.exports = router;
