var Theme = require('../models/theme');
var Stock = require('../models/stock');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var ThemeStockComposition = require('../models/themeStockComposition');
var baseRepository = require('./dataRepository');
var _ = require('underscore');

module.exports = {
    insertManyAllocations: insertManyAllocations,
    getStockAllocationsByTheme: getStockAllocationsByTheme,
    addUserStockAllocation: addUserStockAllocation,
    updateUserStockAllocation: updateUserStockAllocation
}

function insertManyAllocations(themeId, user, stockAllocationData, callback) {
    baseRepository.getById(Theme, themeId, function(err, theme) {
        if (err) {
            return callback(err, null);
        }
        saveAllStockAllocations(theme, user, stockAllocationData, function(err, results) {
            if (err) {
                return callback(err, null)
            }
            console.log('Theme')
            return callback(null, results);
        });
    });
}

function addThemeStockCompositionAndUserAllocation(theme, stock, user, exposure, callback) {
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
}

function addUserStockAllocation(themeStockCompositionId, user, exposure, callback) {
    baseRepository.getById(ThemeStockComposition, themeStockCompositionId, function(err, themeStockComposition) {
        if(err) {
            console.log('could it be here')
            return callback(err, null);
        }

        addAllocationWithThemeStockComposition(themeStockComposition, user, exposure, callback);
    });
}

function addAllocationWithThemeStockComposition(themeStockComposition, user, exposure, callback) {
    var allocation = UserThemeStockAllocation({
        user: user,
        themeStockComposition: themeStockComposition,
        exposure: exposure
    });

    baseRepository.save(allocation, function(err, result) {
        if(err) {
            return callback(err, null);
        }

        return callback(null, result);
    });
}

function updateUserStockAllocation(userAllocationId, exposure, callback) {
    baseRepository.getById(UserThemeStockAllocation, userAllocationId, function(err, allocation) {
        if(err) {
            return callback(err, null);
        }

        allocation.exposure = exposure; //update value
        baseRepository.save(allocation, function(err, result) {
           if(err) {
               return callback(err, null);
           }
           return callback(null, result);
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

        //TODO: check if user has already an allocation for that theme-stock combination?
        //if we assume the theme-stock composition doesn't exist already
        //addThemeStockCompositionAndUserAllocation(theme, stock, user, exposure, callback);

        //check if theme-stock composition doesn't exist
        ThemeStockComposition.find({theme: theme._id, stock: stock._id}, function(err, existingComposition){
            if(err) {
                return callback(err, null);
            }

            if(existingComposition != undefined && existingComposition.length > 0) {
                addAllocationWithThemeStockComposition(existingComposition[0], user, exposure, callback);
            } else {
                addThemeStockCompositionAndUserAllocation(theme, stock, user, exposure, callback);
            }
        });
    });
}

function getStockAllocationsByTheme(themeId, callback) {
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
                var stockExposureDistribution = groupByStockAndExposure(nonNullEntries);
                return callback(null, stockExposureDistribution);
            }

            return callback(null, []);

        });
};

function groupByStockAndExposure(stockAllocations) {
    var groupedByStock = _.groupBy(stockAllocations, function(stockAllocation) {
        return stockAllocation.themeStockComposition._id
    });

    var exposureDistributionPerStock = [];
    _.each(groupedByStock, function(value, key, list) {
        var element = {};
        element.themeStockCompositionId = key;
        element.exposureDistribution = aggregateExposureDistribution(value);
        exposureDistributionPerStock.push(element)
    });

    return exposureDistributionPerStock;
}

function aggregateExposureDistribution(allocationsPerStock) {
    var totalCount = allocationsPerStock.length;
    return _.chain(allocationsPerStock)
        .countBy(function(stockAllocation) {
            return stockAllocation.exposure; })
        .map(function(value, key) {
            return {
                value: key,
                count: value,
                percentage: roundUp(100*value/totalCount, 10)
            }
        })
        .value();
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}
