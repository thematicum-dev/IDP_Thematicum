var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var repository = require('../data_access/dataRepository');
var User = require('../models/user');
var Stock = require('../models/stock');
var repository = require('../data_access/dataRepository');
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

router.post('/stocks', function (req, res, next) {
    getStockAllocation(req.body.stockAllocation, function(err, allocatedStocks) {
        console.log('Getting stock allocation:')
        console.log(allocatedStocks)
        if (err) {
            next(err)
        }

        return res.status(201).json({
            stockAlloc: allocatedStocks
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
