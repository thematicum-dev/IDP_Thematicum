var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
    return res.json({
        text: 'GET investment themes'
    })
});

//test - protected routes from now on
router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if(err) {
            //invalid token
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }

        next();
    });
});

router.get('/all', function (req, res, next) {
    return res.json({
        text: 'GET investment themes - protected'
    })
});



module.exports = router;
