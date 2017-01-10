var _ = require('underscore');
var UserThemeInput = require('../models/userThemeInput');
var Theme = require('../models/theme');
var Stock = require('../models/stock');
var userInputAggregation = require('../utilities/userInputAggregation');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var ThemeStockComposition = require('../models/themeStockComposition');
var Test = require('../models/testModel');
var mongoose = require('mongoose');
var baseRepository = require('./dataRepository');
var _ = require('underscore');

module.exports = {
    insertManyAllocations: insertManyAllocations,
    getStockAllocationsByTheme: getStockAllocationsByTheme
}

function insertManyAllocations(themeId, user, stockAllocationData, callback) {
    baseRepository.getById(Theme, themeId, function(err, theme) {
        saveAllStockAllocations(theme, user, stockAllocationData, function(err, results) {
            if (err) {
                return callback(err, null)
            }

            return callback(null, results);
        });
    });
}

function saveAllStockAllocations(theme, user, stockAllocationData, callback) {
    var allocatedStocks = [];
    stockAllocationData.forEach(function(item, index){
        var stockId = item.stockId;
        var exposure = item.exposure;

        //saveOneStockAllocation
        saveOneStockAllocation(theme, user, stockId, exposure, function(err, result) {
            if(err) {
                return callback(err, null);
            }

            allocatedStocks.push(result)

            if (index == stockAllocationData.length - 1) {
                return callback(null, allocatedStocks);
            }
        });
    }); //end forEach
}

function saveOneStockAllocation(theme, user, stockId, exposure, callback) {
    baseRepository.getById(Stock, stockId, function (err, stock) {
        if(err) {
            return callback(err, null)
        }

        var themeStockComposition = new ThemeStockComposition({
            theme: theme,
            stock: stock,
            addedBy: user
        });

        baseRepository.save(themeStockComposition, function(err, savedThemeStockComposition) {
            if (err) {
                return callback(err, null);
            }

            var userThemeStockAllocation = new UserThemeStockAllocation({
                user: user,
                themeStockComposition: savedThemeStockComposition,
                exposure: exposure
            });

            baseRepository.save(userThemeStockAllocation, function(err, savedUserThemeStockAllocation) {
                if(err) {
                    return callback(err, null);
                }

                return callback(null, savedUserThemeStockAllocation);
            });
        });
    });
}

function getStockAllocationsByTheme(themeId, callback) {
    // - 1
    // ThemeStockComposition.find({theme: themeId}, function(err, stockCompositions) {
    //     if (err) {
    //         return callback(err, null);
    //     }
    //
    //     var IDs = stockCompositions.map(function(input) { return input._id; }); //array of id-s
    //
    //     //get the UserThemeStockAllocation documents where the allocation is included in IDs
    //     UserThemeStockAllocation
    //         .find({themeStockComposition: {$in: IDs}})
    //         .populate('themeStockComposition.stock', '_id stock')
    //         .exec(function(err, stockAllocations) {
    //         if (err) {
    //             return callback(err, null);
    //         }
    //
    //         x = _.countBy(stockAllocations, 'themeStockComposition.stock._id')
    //         console.log(x)
    //
    //         return callback(null, stockAllocations);
    //
    //     });
    //
    // });

    // -- 2
    //
    // UserThemeStockAllocation
    //     .populate('themeStockComposition', '_id theme stock')
    //     .match({$themeStockComposition.theme: themeId)
    //     .exec(function(err, allocationsPerTheme) {
    //         if (err) {
    //             callback(err, null);
    //         }
    //
    //     });

    // -- 3
    // UserThemeStockAllocation.
    //     .populate('themeStockComposition', '_id theme stock')
    //     .aggregate()
    //     .match({themeStockComposition.theme })

    UserThemeStockAllocation
        .find()
        .populate({
            path: 'themeStockComposition',
            match: { theme: themeId }
        }).exec(function(err, results) {
            if (err) {
                return callback(err, null);
            }

            //filter non-null entries
            var nonNullEntries = _.filter(results, function(input) {
                return input.themeStockComposition != null;
            });

            if(nonNullEntries != undefined && nonNullEntries.length > 0) {
                //themeData.userInputs = nonNullEntries[0];

                //aggregate
                //_.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
                // x = _.groupBy(nonNullEntries, function(input) {
                //     return input.themeStockComposition.stock
                // })

                //this is an object/dict
                /*
                 { stockId: [ ],
                 stockId: [ ]
                 }
                 */

                var groupedByStock = _.chain(nonNullEntries)
                    .groupBy(function(input) { return input.themeStockComposition.stock }) //group by stock
                    //each of the input is an array
                    .value();

                var exposureDistributionPerStock = [];
                _.each(groupedByStock, function(value, key, list) {
                    console.log('Key: ', key);
                    var element = {};
                    element.stockId = key;
                    element.exposureDistribution = _.countBy(value, function(stockAllocation) {
                        return stockAllocation.exposure;
                    });
                    exposureDistributionPerStock.push(element)
                });
                return callback(null, exposureDistributionPerStock);
            }
        });
};

function filterStockAllocationsByTheme(stockAllocations, themeId) {
    var nonNullEntries = _.filter(stockAllocations, function(input) {
        return input.theme._id == themeId;
    });
}
