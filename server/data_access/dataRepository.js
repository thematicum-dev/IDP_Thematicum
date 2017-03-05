import BaseRepository from './baseRepository';
var User = require('../models/user');
var Theme = require('../models/theme');
var mongoose = require('mongoose');
var AppError = require('../utilities/appError');
var UserThemeInput = require('../models/userThemeInput');
var ThemeStockComposition = require('../models/themeStockComposition');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var RegistrationAccessCode = require('../models/accessCode');
var Stock = require('../models/stock');
var _ = require('underscore');
import StockAllocationAggregation from '../utilities/test';

export default class DataRepository extends BaseRepository {
    constructor() {
        super();
    }

    getValidAccessCodes() {
        let timeInMillis = new Date().getTime();
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
            .sort({score: {$meta: "textScore"}})
            .exec();
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

    getThemePropertyByThemeAndUser(themeId, userId) {
        return UserThemeInput.findOne({theme: themeId, user: userId}).exec();
    }

    getThemePropertiesByTheme(themeId) {
        return UserThemeInput.find({theme: themeId}, 'themeProperties').exec();
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
                    let stockAllocationAggregation = new StockAllocationAggregation();
                    let aggregation = stockAllocationAggregation.getThemePropertiesAggregation(allocations);

                    let stockAllocationByCurrentUser = this.getStockAllocationByUser(allocations, currentUserId);

                    let obj = {themeStockComposition: themeStockComposition, exposures: aggregation.exposure, userStockAllocation: stockAllocationByCurrentUser};
                    resolve(obj);
                })
                .catch(err => reject(err));
        });
    }

    getStockAllocationByUser(allocations, userId) {
        return allocations.find(allocation => allocation.user == userId);
    }

    deleteThemeData(theme) {
        let deleteThemePromise = this.remove(theme); //delete theme
        let deleteUserThemeInputsPromise = UserThemeInput.remove({theme: theme._id}).exec(); //delete user theme inputs

        //delete theme-stock compositions and their related stock allocations
        let deleteStocksPromise = ThemeStockComposition.find({theme: theme._id}).exec()
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