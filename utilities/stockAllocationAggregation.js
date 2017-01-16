var _ = require('underscore');

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
        //TODO: get other details
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