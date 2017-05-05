import mongoose from 'mongoose';
import BaseRepository from './baseRepository';
import DataRepository from './dataRepository';
import User from '../models/user';
import Theme from '../models/theme';
import {AppError} from '../utilities/appError';
import UserThemeInput from '../models/userThemeInput';
import ThemeStockComposition from '../models/themeStockComposition';
import UserThemeStockAllocation from '../models/userThemeStockAllocation';
import RegistrationAccessCode from '../models/accessCode';
import Stock from '../models/stock';
import { ThemePropertiesAggregation, StockAllocationAggregation } from '../utilities/dataAggregation';

export default class QueryBuilder {
    constructor() {}

    selectModel(model){
        this.model = model; // e.g. Theme, User, Stock
        return this;
    }

    textSearch(searchQuery){
        this.model = this.model.find(
                {$text: {$search: searchQuery}},
                {score: {$meta: 'textScore'}})
                .sort({score: {$meta: "textScore"}});
        return this;
    }

    findAll(){
        this.model = this.model.find();
        return this;
    }

    sortDescending(){
        this.model = this.model.sort([['_id', -1]]);
        return this;
    }

    // .skip is slow for large values
    skip(start, limit){
        this.model = this.model.skip(start - 1).limit(limit);
        return this;
    }

    count(){
        this.model = this.model.count();
        return this;
    }

    // only this function is allowed to use exec() call or to return a promise
    exec(){
         return new Promise((resolve, reject) => {
            this.model.exec().then(result => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }
}