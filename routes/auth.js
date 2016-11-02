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
    //encrypt password
    // var user = new User({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     password: bcrypt.hashSync(String(req.body.password), 10)
    // });
    //
    // console.log(user)
    // user.save(function(err, result) {
    //     if (err) {
    //         return res.status(500).json({
    //             title: 'An error occurred',
    //             error: err
    //         });
    //     }
    //
    //     res.status(201).json({
    //         message: 'User created',
    //         obj: result
    //     });
    // });

    console.log('post to auth route')
});

module.exports = router;
