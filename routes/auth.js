var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//test
//http://localhost:3000/auth
router.get('/', function(req, res, next) {
    return res.json({
        text: 'hello world'
    })
});

//create a user
router.post('/', function (req, res, next) {
    //check here for password length, since it will be later encrypted
    if (req.body.password.length < 8) {
        return res.status(500).json({
            title: 'Validation error: password must be no shorter than 8 characters'
        });
    }

    //encrypt password
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(String(req.body.password), 10),
        personalRole: req.body.personalRole
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

//sign in
router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        if(!user) {
            //unauthorized status code
            //use generic, not specific, error message
            return res.status(401).json({
                title: 'Login failed',
                error: { message: 'Invalid login credentials' }
            });
        }

        //check password
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: { message: 'Invalid login credentials' }
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
