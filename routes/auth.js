var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');

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

module.exports = router;
