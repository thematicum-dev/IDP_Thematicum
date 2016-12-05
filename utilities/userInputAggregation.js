var _ = require('underscore');

module.exports = {
    roundUp: roundUp,
    getThemePropertyData: getThemePropertyData,
    getCountByProperty: getCountByProperty,
    getSumByProperty: getSumByProperty,
    getAggregationByProperty: getAggregationByProperty,
    getThemePropertiesAggregation: getThemePropertiesAggregation
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}

function getThemePropertyData(userThemeInputs) {
    groupedByProperties = _.chain(userThemeInputs)
        .map(function(userInput) { return userInput.themePropertyInputs; })
        .flatten()
        .groupBy('property')
        .value();

    timeHorizonData = aggregateThemeProperty(groupedByProperties.timeHorizon);
    maturityData = aggregateThemeProperty(groupedByProperties.maturity);
    categoriesData = aggregateThemeProperty(groupedByProperties.categories);

    return { "timeHorizon": timeHorizonData, "maturity": maturityData, "categories": categoriesData };
}

function aggregateThemeProperty(propertyInput) {
    votesDistribution = _.chain(propertyInput)
        .map(function(prop) {
            return prop.valueChosen
        })
        .flatten()
        .countBy()
        .value();

    sum = _.reduce(votesDistribution, function(memo, num){ return memo + num; }, 0); //sum up votes

    aggregationData = _.map(votesDistribution, function(val, key) {
        val = { value: key, count: val, percentage: roundUp(100*val/sum, 10) }
        return val;
    });

    return aggregationData;
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