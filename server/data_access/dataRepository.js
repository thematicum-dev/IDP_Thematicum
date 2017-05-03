import mongoose from 'mongoose';
import BaseRepository from './baseRepository';
import QueryBuilder from './queryBuilder';
import User from '../models/user';
import Theme from '../models/theme';
import {AppError} from '../utilities/appError';
import UserThemeInput from '../models/userThemeInput';
import ThemeStockComposition from '../models/themeStockComposition';
import UserThemeStockAllocation from '../models/userThemeStockAllocation';
import RegistrationAccessCode from '../models/accessCode';
import Stock from '../models/stock';
import { ThemePropertiesAggregation, StockAllocationAggregation } from '../utilities/dataAggregation';

export default class DataRepository extends BaseRepository {
    constructor() {
        super();
    }

    getValidAccessCodes() {
        const timeInMillis = new Date().getTime();
        return RegistrationAccessCode.find({validFrom: {'$lte': timeInMillis}, validUntil: {'$gte': timeInMillis}}).exec();
    }

    isAccessCodeValid(code, currentTime) {
        return RegistrationAccessCode.findOne({code: code, validFrom: {'$lte': currentTime}, validUntil: {'$gte': currentTime}}).exec();
    }

    getUserByEmail(email) {
        return User.findOne({email: email}).exec();
    }

    getThemeTags() {
        return Theme.find().distinct('tags').exec();
    }

    getThemeBySearchQuery(searchQuery) {
        return Theme.find(
            {$text: {$search: searchQuery}},
            {score: {$meta: 'textScore'}})
            .sort({score: {$meta: "textScore"}}).exec();
    }

    // .skip is slow for large values
    getThemeRangeBySearchQuery(searchQuery, start, limit){

        return new Promise((resolve, reject) => {
            (new QueryBuilder()).selectModel(Theme).textSearch(searchQuery).count().exec().then(count => {
                (new QueryBuilder()).selectModel(Theme).textSearch(searchQuery).skip(start, limit).exec().then(result => {
                    const obj = { result: result, count: count };
                    resolve(obj);
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
    }

    getThemeById(id) {
        return new Promise((resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject(new AppError('Invalid Object Id', 400));
            } else {
                resolve(Theme.findById(id).populate('creator', 'name personalRole').exec());
            }
        });
    }

    getThemePropertyById(id) {
        return new Promise((resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject(new AppError('Invalid Object Id', 400));
            } else{
                resolve(UserThemeInput.findById(id).populate('user', '_id').exec());
            }
        });
    }

    getThemePropertiesByThemeId(themeId, userId) {
        // aggregates all user theme inputs
        return new Promise((resolve, reject) => {
            UserThemeInput.find({theme: themeId}).exec()
                .then(results => {

                    const aggregation = new ThemePropertiesAggregation();
                    const themeProperties = aggregation.getThemeDataAggregation(results);

                    const totalCount = results ? results.length : 0;
                    const themePropertiesByCurrentUser = this.getThemePropertiesByUser(results, userId);
                    const obj = {properties: themeProperties, userInputs: themePropertiesByCurrentUser, totalCount: totalCount};

                    resolve(obj);
                })
                .catch(err => reject(err))
        });
    }

    notExistStockAllocationsForThemeStockComposition(compositionId) {
        return new Promise((resolve, reject) => {
            UserThemeStockAllocation.find({themeStockComposition: compositionId}).exec()
                .then(results => {
                    resolve(!results || results.length == 0);
                })
                .catch(err => reject(err));
        });
    }

    getThemePropertiesByUser(properties, userId) {
        return properties.find(property => property.user == userId);
    }

    getThemeStockCompositionsByTheme(themeId) {
        return ThemeStockComposition.find({theme: themeId})
            .populate('stock', 'companyName country')
            .exec();
    }

    getStockAllocationsByThemeStockComposition(themeStockComposition, currentUserId) {
        return new Promise((resolve, reject) => {
            UserThemeStockAllocation.find({themeStockComposition: themeStockComposition._id}).exec()
                .then(allocations => {
                    //aggregation
                    const stockAllocationAggregation = new StockAllocationAggregation();
                    const aggregation = stockAllocationAggregation.getDataAggregation(allocations);
                    const totalCount = allocations ? allocations.length : 0;

                    const stockAllocationByCurrentUser = this.getStockAllocationByUser(allocations, currentUserId);

                    const obj = {themeStockComposition: themeStockComposition, exposures: aggregation.exposure, userStockAllocation: stockAllocationByCurrentUser, totalCount: totalCount};
                    resolve(obj);
                })
                .catch(err => reject(err));
        });
    }

    getStockAllocationByUser(allocations, userId) {
        return allocations.find(allocation => allocation.user == userId);
    }

    deleteThemeData(theme) {
        const deleteThemePromise = this.remove(theme); //delete theme
        const deleteUserThemeInputsPromise = UserThemeInput.remove({theme: theme._id}).exec(); //delete user theme inputs

        //delete theme-stock compositions and their related stock allocations
        const deleteStocksPromise = ThemeStockComposition.find({theme: theme._id}).exec()
            .then(compositions => {
                compositions.map(composition => {
                    return Promise.all([this.remove(composition), UserThemeStockAllocation.remove({themeStockComposition: composition._id}).exec()]);
                });
            });

        return Promise.all([deleteThemePromise, deleteUserThemeInputsPromise, deleteStocksPromise]);
    }

    createStockCompositionAndAllocation(allocationData, theme, user) {
        return this.getById(Stock, allocationData.stockId)
            .then(stock => {
                return this.createThemeStockComposition(theme, stock, user);
            })
            .then(themeStockComposition => {
                return this.createStockAllocation(themeStockComposition, user, allocationData.exposure)
            });

        //TODO: add .catch?
    }

    createThemeStockComposition(theme, stock, user) {
        const themeStockComposition = new ThemeStockComposition({
            theme: theme,
            stock: stock,
            addedBy: user
        });

        return this.save(themeStockComposition);
    }

    createStockAllocation(themeStockComposition, user, exposure) {
        const stockAllocation = new UserThemeStockAllocation({
            user: user,
            themeStockComposition: themeStockComposition,
            exposure: exposure
        });

        return this.save(stockAllocation);
    }
}