var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var repository = require('../data_access/dataRepository');
var User = require('../models/user');
var Stock = require('../models/stock');
var Theme = require('../models/theme');
var repository = require('../data_access/dataRepository');
var stockRepo = require('../data_access/stockRepository');
var Promise = require('promise');

router.get('/', function (req, res, next) {
    //callback here
    repository.getAll(User, function(err, objects){
        console.log(objects);
        return res.json({
            data: objects
        })
    });
});

router.post('/stocks/:themeId', function (req, res, next) {
    repository.getById(Theme, req.params.themeId, function(err, theme) {
        if (err) {
            console.log('Is next called?')
            return next(err);
        }

        console.log('test', theme)

        repository.getThemeStocks(theme._id, function(err, results) {
            if(err) {
                return next(err)
            }

            return res.status(200).json({
                themeStocks: results
            });
        });
    });
});

router.get('/stocks', function(req, res, next) {
    stockRepo.insertMany(function(err, results) {
       if(err) {
           return next(err);
       }

       return res.status(200).json({
           test: results
       });
    });
});

function getStockAllocation(stockAllocationData, callback) {
    var allocatedStocks = [];
    stockAllocationData.forEach(function(item, index){
        var stockId = item.stockId;
        var exposure = item.exposure;
        setStockAndExposure(stockId, exposure, function(err, result) {
            if(err) {
                callback(err, null)
            }

            allocatedStocks.push(result)
            if (index == stockAllocationData.length -1) {
                callback(null, allocatedStocks)
            }
        });
    });
}

function setStockAndExposure(stockId, exposure, callback) {
    repository.getById(Stock, stockId, function(err, result) {
        if (err) {
            callback(err, null)
        }

        var stockAlloc = {stock: result, exposure: exposure};
        callback(null, stockAlloc);
    });
}


module.exports = router;
