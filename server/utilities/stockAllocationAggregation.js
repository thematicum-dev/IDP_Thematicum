var _ = require('underscore');
var constants = require('./constants');

module.exports = {
    groupByStockAndExposure: groupByStockAndExposure
}
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
    let totalCount = allocationsPerStock.length;
    let totalExposureValuesNr = constants.TOTAL_EXPOSURE_VALUES;
    var exposureArray = new Array(totalExposureValuesNr);

    _.chain(allocationsPerStock)
        .countBy(function(stockAllocation) {
            return stockAllocation.exposure;
        })
        .each(function(value, key, list) {
            console.log('Key: ', key, ' Value: ', value);
            exposureArray[key] = {
                value: key,
                count: value,
                percentage: roundUp(100*value/totalCount, 10)
            };
        });

    fixupExposureValues(exposureArray);
    return exposureArray;
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}

function fixupExposureValues(array) {
    //add dummy object representing an exposure with 0 votes
    for (var i =0; i<array.length; i++) {
        if (!array[i]) {
            array[i] = {
                value: i,
                count: 0,
                percentage: 0
            };
        }
    }
}