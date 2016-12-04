var _ = require('underscore');

module.exports = {
    aggregateThemeProperty: aggregateThemeProperty
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
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

    return { property: propertyName, aggregationData: aggregationData}
}