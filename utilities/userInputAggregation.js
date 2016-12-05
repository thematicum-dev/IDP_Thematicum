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
    console.log('At aggr by property')
    console.log(collection)
    var array = new Array(5); //5 elements
    _.each(collection, function(val, key) {
        val = { value: key, count: val, percentage: roundUp(100*val/sum, 10) };
        array[key-1] = val;
    });

    fixup(array);

    return array;
    console.log('What is array?')
    console.log(array)
    //check for non-existing values

}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}

function fixup(array) {
    //add dummy object representing a property not yet selected by users
    for (var i =0; i<array.length; i++) {
        if (!array[i]) {
            array[i] = {
                value: i+1,
                count: 0,
                percentage: 0
            };
        }
    }
}