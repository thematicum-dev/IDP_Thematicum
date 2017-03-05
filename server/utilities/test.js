var _ = require('underscore');
var constants = require('./constants');
import ThemePropertiesAggregation from './userInputAggregation';

export default class StockAllocationAggregation extends ThemePropertiesAggregation {
    constructor() {
        super();
        this.propertyList = [{
            propertyName: 'exposure',
            nrValuesRequired: constants.TOTAL_EXPOSURE_VALUES
        }];
    }

    getCountByProperty(collection, propertyName) {
        return _.chain(collection)
            .map(function(input) { return input[propertyName]})
            .flatten()
            .countBy()
            .value();
    }

}