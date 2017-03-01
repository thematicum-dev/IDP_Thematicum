var _ = require('underscore');

// module.exports = {
//     getThemePropertiesAggregation: getThemePropertiesAggregation
// }

export function getThemePropertiesAggregation(collection, propertyList) {
    var aggregation = {};
    _.each(propertyList, function(prop) {
        let countByProp = getCountByProperty(collection, prop.propertyName)
        let sumByProp = getSumByProperty(countByProp)
        let aggregationByProp = getAggregationByProperty(countByProp, sumByProp, prop.nrValuesRequired)
        aggregation[prop.propertyName] = aggregationByProp;
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

function getAggregationByProperty(collection, sum, nrValuesRequired) {
    //this also guarantees sorting by property value
    var valuesArray = new Array(nrValuesRequired);

    _.each(collection, function(val, key) {
        val = { value: key, count: val, percentage: roundUp(100*val/sum, 10) };
        valuesArray[key] = val;
    });

    fixupValuesArray(valuesArray);
    return valuesArray;
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}

function fixupValuesArray(array) {
    //add dummy object representing a property not yet selected by users
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