var _ = require('underscore');

module.exports = {
    getThemePropertiesAggregation: getThemePropertiesAggregation
}

function getThemePropertiesAggregation(collection, propertyList) {
    var aggregation = {};
    _.each(propertyList, function(prop) {
        countByProp = getCountByProperty(collection, prop)
        sumByProp = getSumByProperty(countByProp)
        aggregationByProp = getAggregationByProperty(countByProp, sumByProp)
        aggregation[prop] = aggregationByProp;
    });

    return aggregation;
}

function getCountByProperty(collection, propertyName) {
    return _.chain(collection)
        .map(function(input) { return input.themeProperties[propertyName]})
        .flatten()
        .countBy()
        .value();
}

function getSumByProperty(collection) {
    return _.reduce(collection, function(memo, num){ return memo + num; }, 0);
}

function getAggregationByProperty(collection, sum) {
    return _.map(collection, function(val, key) {
        val = { value: key, count: val, percentage: roundUp(100*val/sum, 10) }
        return val;
    });
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}