import _ from 'underscore';
import UserThemeInputAggregation from '../models/userThemeInputAggregation';
import constants from '../utilities/constants';
import DataRepository from '../data_access/dataRepository';

class DataAggregation {
    constructor() {}

    getDataAggregation(collection) {
        let aggregation = {};

        for (const prop of this.propertyList) {
            const countByProp = this.getCountByProperty(collection, prop.propertyName);
            const sumByProp = this.getSumByProperty(countByProp);
            const aggregationByProp = this.getAggregationByProperty(countByProp, sumByProp, prop.nrValuesRequired);
            aggregation[prop.propertyName] = aggregationByProp;
        }

        return aggregation;
    }

    getCountByProperty(collection, propertyName) {
        return _.chain(collection)
            .map(function(input) { return input[propertyName]})
            .flatten()
            .countBy()
            .value();
    }

    getSumByProperty(collection) {
        return _.reduce(collection, function(memo, num){ return memo + num; }, 0);
    }

    getAggregationByProperty(collection, sum, nrValuesRequired) {
        //create array with dummy values
        let valuesArray = Array.from({length: nrValuesRequired}, (v, k) => {return {value: k, count: 0, percentage: 0}});

        //update properties with count and percentage
        for (const [key, val] of Object.entries(collection)) {
            const value = { value: key, count: val, percentage: this.roundUp(100*val/sum, 10) };
            valuesArray[key] = value;
        }

        return valuesArray;
    }

    roundUp(num, precision) {
        return Math.ceil(num * precision) / precision
    }
}

export class ThemePropertiesAggregation extends DataAggregation {

    constructor() {
        super();        
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
    
    getThemeDataAggregation(collection) {
        const themeAggregation = this.getDataAggregation(collection);
        this.setThemeDataAggregation(themeAggregation);
        return themeAggregation;
    }

    setThemeDataAggregation(themeAggregation){
        let userThemeInputAggregation = {};

        for (const prop of this.propertyList) {
            userThemeInputAggregation[prop.propertyName] = [];
            let maxValue = Math.max.apply(Math,themeAggregation[prop.propertyName].map(function(o){return o.percentage;}))
            let results = themeAggregation[prop.propertyName].filter(function(o){ return o.percentage == maxValue; })
            for(const result of results){
                userThemeInputAggregation[prop.propertyName].push(parseInt(result.value));
            }
            console.log(userThemeInputAggregation);
        }
        this.create(userThemeInputAggregation);
    }

    create(userThemeInputAggregation) {        
        const repo = new DataRepository();
        const themeAggregation = new UserThemeInputAggregation({
            timeHorizon: userThemeInputAggregation.timeHorizon,
            maturity: userThemeInputAggregation.maturity,
            categories: userThemeInputAggregation.categories
        });

        repo.save(themeAggregation)
            .then(() => console.log("User Theme Aggregated"))
            .catch(err => next(err));
    }
}

export class StockAllocationAggregation extends DataAggregation {
    constructor() {
        super();
        this.propertyList = [{
            propertyName: 'exposure',
            nrValuesRequired: constants.TOTAL_EXPOSURE_VALUES
        }];
    }
}