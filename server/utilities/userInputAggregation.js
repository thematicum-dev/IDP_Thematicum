var _ = require('underscore');
var constants = require('./constants');

export default class ThemePropertiesAggregation {
    constructor() {
        this.propertyList = [{
            propertyName: 'timeHorizon',
            nrValuesRequired: constants.TOTAL_TIME_HORIZON_VALUES
        }, {
            propertyName: 'maturity',
            nrValuesRequired: constants.TOTAL_MATURITY_VALUES
        }, {
            propertyName: 'categories',
            nrValuesRequired: constants.TOTAL_CATEGORY_VALUES
        }];
    }

    getThemePropertiesAggregation(collection) {
        var aggregation = {};

        for (let prop of this.propertyList) {
            let countByProp = this.getCountByProperty(collection, prop.propertyName)
            let sumByProp = this.getSumByProperty(countByProp)
            let aggregationByProp = this.getAggregationByProperty(countByProp, sumByProp, prop.nrValuesRequired);
            aggregation[prop.propertyName] = aggregationByProp;
        }

        return aggregation;
    }

    getCountByProperty(collection, propertyName) {
        return _.chain(collection)
            .map(function(input) { return input.themeProperties[propertyName]})
            .flatten()
            .countBy()
            .value();
    }

    getSumByProperty(collection) {
        return _.reduce(collection, function(memo, num){ return memo + num; }, 0);
    }

    getAggregationByProperty(collection, sum, nrValuesRequired) {
        //this also guarantees sorting by property value
        var valuesArray = new Array(nrValuesRequired);

        for (let [key, val] of Object.entries(collection)) {
            let value = { value: key, count: val, percentage: this.roundUp(100*val/sum, 10) };
            valuesArray[key] = value;
        }

        this.fixupValuesArray(valuesArray);
        return valuesArray;
    }

    roundUp(num, precision) {
        return Math.ceil(num * precision) / precision
    }

    fixupValuesArray(array) {
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
}