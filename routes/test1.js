var express = require('express');
var router = express.Router();
var controller = require('./test1controller');
// var app = express();
//
// app.param(':id', function(res, req, next){
//    console.log('hi')
// });

router.param('id', function(req, res, next, idParam) {
    //console.log('id is: ', idParam);
    req.id = idParam;
    next();
});
router.route('/catalogue/:id')
    .get(controller.apiGET);

module.exports = router;

// module.exports = function (app) {
//     app.route('/catalogue')
//         .all(function (req, res, next) {
//             next();
//         })
//         .get(controller.apiGET);
// }

    //app.param
// }
// router.route('/catalogue')
//     .get(controller.apiGET);

// module.exports = router;

