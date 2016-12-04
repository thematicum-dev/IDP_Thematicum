var _ = require('underscore');

module.exports = {
    aggregateThemeProperty: aggregateThemeProperty
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}

function groupThemePropertyData(userThemeInputs) {
    groupedByProperties = _.chain(userThemeInputs)
        .map(function(userInput) { return userInput.themePropertyInputs; })
        .flatten()
        .groupBy('property')
        .value();

    timeHorizonData = aggregateThemeProperty(groupedByProperties.timeHorizon, "timeHorizon");
    maturityData = userInputAggregation.aggregateThemeProperty(groupedByProperties.maturity, "maturity");
    categoriesData = userInputAggregation.aggregateThemeProperty(groupedByProperties.categories, "categories");

    return [ timeHorizonData, maturityData, categoriesData ];
}

function aggregateThemeProperty(propertyInput, propertyName) {
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

    return { [propertyName]: aggregationData}
}