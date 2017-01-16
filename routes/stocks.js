var express = require('express');
var router = express.Router();
var stockRepository = require('../data_access/stockRepository');
var authUtilities = require('../utilities/authUtilities');

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.post('/', function(req, res, next) {
    // req.query.selectedThemeId, res.locals.user, req.body
    stockRepository.insertManyAllocations(req.query.selectedThemeId, res.locals.user, req.body.stockAllocation, function(err, results){
        if(err) {
            return next(err);
        }

        return res.status(201).json({
            message: 'Stock allocations inserted',
            obj: results
        });
    });
});

router.get('/', function(req, res, next) {
   stockRepository.getStockAllocationsByTheme(req.query.selectedThemeId, function(err, results) {
       if(err) {
           return next(err);
       }

       return res.status(201).json({
           message: 'Stock allocations for theme',
           obj: results
       });
   });
});

module.exports = router;