var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var accessCodeValidity = require('../utilities/isAccessCodeValid');

//test
//http://localhost:3000/auth
router.get('/', function(req, res, next) {
    return res.json({
        text: 'hello world'
    })
});

//create a user
router.post('/', function (req, res, next) {
    //check accessCode validity
    accessCodeValidity.isAccessCodeValid(req.body.accessCode, req.body.currentTime, function(err, results) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        if(!results) {
            return res.status(500).json({
                title: 'Invalid Access Code'
            });
        }

        //check here for password length, since it will be later encrypted
        if (req.body.user.password.length < 8) {
            return res.status(500).json({
                title: 'Validation error: password must be no shorter than 8 characters'
            });
        }

        //encrypt password
        var user = new User({
            name: req.body.user.name,
            email: req.body.user.email,
            password: bcrypt.hashSync(String(req.body.user.password), 10),
            personalRole: req.body.user.personalRole
        });

        console.log(user);
        user.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            res.status(201).json({
                message: 'User created',
                obj: result
            });
        });
    });
});

//sign in
router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return next({
                title: 'An error occurred',
                error: err
            });
        }

        if(!user) {
            //unauthorized status code
            //use generic, not specific, error message
            return next({
                title: 'Login failed',
                error: { message: 'Invalid login credentials' },
                status: 401
            });
        }

        //check password
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return next({
                title: 'Login failed',
                error: { message: 'Invalid login credentials' },
                status: 401
            });
        }

        //valid login credentials (valid for 7200sec = 2hr)
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'Successful login',
            token: token,
            userId: user._id,
            username: user.name
        })
    });
});

module.exports = router;
