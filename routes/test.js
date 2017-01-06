var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var repository = require('../data_access/dataRepository');
var User = require('../models/user');

router.get('/', function (req, res, next) {
    //callback here
    repository.getAll(User, function(err, objects){
        console.log(objects);
        return res.json({
            data: objects
        })
    });
});

//test - protected routes from now on
// router.use('/', function(req, res, next) {
//     jwt.verify(req.query.token, 'secret', function(err, decoded) {
//         if(err) {
//             //invalid token
//             return res.status(401).json({
//                 title: 'Not Authenticated',
//                 error: err
//             });
//         }
//
//         next();
//     });
// });

router.get('/all', function (req, res, next) {
    return res.json({
        text: 'GET investment themes - protected'
    })
});



module.exports = router;
