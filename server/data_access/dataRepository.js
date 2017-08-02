import mongoose from 'mongoose';
import BaseRepository from './baseRepository';
import QueryBuilder from './queryBuilder';
import User from '../models/user';
import Theme from '../models/theme';
import ActivityLog from '../models/activitylog';
import {AppError} from '../utilities/appError';
import UserThemeInput from '../models/userThemeInput';
import ThemeStockComposition from '../models/themeStockComposition';
import UserThemeStockAllocation from '../models/userThemeStockAllocation';
import RegistrationAccessCode from '../models/accessCode';
import Stock from '../models/stock';
import { ThemePropertiesAggregation, StockAllocationAggregation } from '../utilities/dataAggregation';
import constants from '../utilities/constants';

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

    getUserByEmail(email){
        return new Promise((resolve, reject) => {
            User.findOne({email: email}).exec()
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    getUserById(id){
        return new Promise((resolve, reject) => {
            User.findOne({_id: id}).exec()
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    getThemeTags() {
        return Theme.find().distinct('tags').exec();
    }

    getThemeBySearchQuery(searchQuery) {
        return (new QueryBuilder()).selectModel(Theme).textSearch(searchQuery).exec();
    }

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

    // parameter is array of strings
    getThemeByTags(tags){
        return new Promise((resolve,reject) => {
            if (tags.length > 0) {
                Theme.find({ tags: { $in: tags } }).exec()
                    .then(results => resolve(results))
                    .catch(err => reject(err));
            } else {
                Theme.find({ tags: { $nin: [] } }).exec()
                    .then(results => resolve(results))
                    .catch(err => reject(err));
            }
        });
    }

    getThemeByUserThemeQueryPagination(start, limit, searchQuery, categories, maturity, timeHorizon, tags) {
        let countPromise = this.getThemeByUserThemeQuery(searchQuery, categories, maturity, timeHorizon, tags)
            .count().exec();

        let resultPromise = this.getThemeByUserThemeQuery(searchQuery, categories, maturity, timeHorizon, tags)
            .skip(start - 1).limit(limit).exec();

        return new Promise((resolve, reject) => {
            Promise.all([countPromise, resultPromise])
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        }).catch(err => reject(err));
    }

     getThemeByUserStockQueryPagination(start, limit, stockId, categories, maturity, timeHorizon, tags) {
        let countPromise = this.getThemeByUserStockQuery(stockId, categories, maturity, timeHorizon, tags)
            .count().exec();

        let resultPromise = this.getThemeByUserStockQuery(stockId, categories, maturity, timeHorizon, tags)
            .skip(start - 1).limit(limit).exec();

        return new Promise((resolve, reject) => {
            Promise.all([countPromise, resultPromise])
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        }).catch(err => reject(err));
    }

    getThemeByUserThemeQuery(searchQuery, categories, maturity, timeHorizon, tags) {
        let andQuery = [];

        if (searchQuery !== undefined && searchQuery.length > 0)
            andQuery.push({ $text: { $search: searchQuery } });

        if (categories !== undefined && categories.length > 0)
            andQuery.push({ categories: { "$in": categories } });

        if (maturity !== undefined && maturity.length > 0)
            andQuery.push({ maturity: { "$in": maturity } });

        if (timeHorizon !== undefined && timeHorizon.length > 0)
            andQuery.push({ timeHorizon: { "$in": timeHorizon } });

        if (tags !== undefined && tags.length > 0)
            andQuery.push({ tags: { "$in": tags } });

        if (andQuery.length != 0) {
            return Theme.find({ $and: andQuery });
        } else {
            return Theme.find({});
        }
    }

     getThemeByUserStockQuery(stockId, categories, maturity, timeHorizon, tags) {
        let andQuery = [];

        if (stockId !== undefined && stockId.length > 0)
            andQuery.push({ stockTags: { "$in": [stockId] } });

        if (categories !== undefined && categories.length > 0)
            andQuery.push({ categories: { "$in": categories } });

        if (maturity !== undefined && maturity.length > 0)
            andQuery.push({ maturity: { "$in": maturity } });

        if (timeHorizon !== undefined && timeHorizon.length > 0)
            andQuery.push({ timeHorizon: { "$in": timeHorizon } });

        if (tags !== undefined && tags.length > 0)
            andQuery.push({ tags: { "$in": tags } });

        if (andQuery.length != 0) {
            return Theme.find({ $and: andQuery });
        } else {
            return Theme.find({});
        }
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
                    const themeProperties = aggregation.getThemeDataAggregation(themeId, results);

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

    getThemeStockCompositionById(id){
        return new Promise((resolve, reject) => {
            ThemeStockComposition.findOne({_id: id}).exec().then(composition =>{
                resolve(composition)
            }).catch(err => reject(err));
        });
    }

    getStockById(id){
        return new Promise((resolve, reject) => {
            Stock.findOne({_id: id}).exec().then(stock =>{
                resolve(stock)
            }).catch(err => reject(err));
        });
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

        // unfollow all users from the deleted theme
        const deleteThemesUserFollowersPromise = User.update(
            { },
            { $pull: {follows: theme._id } },
            { multi: true }
        );

        return Promise.all([deleteThemePromise, deleteUserThemeInputsPromise, deleteStocksPromise, deleteThemesUserFollowersPromise]);
    }

    createStockCompositionAndAllocation(allocationData, theme, user) {
        let activitylog = new ActivityLog();
        activitylog.user = user._id;
        activitylog.theme = theme._id;
        activitylog.userName = user.name;
        activitylog.themeName = theme.name;
        return this.getById(Stock, allocationData.stockId)
            .then(stock => {
                activitylog.stock = stock.companyName;
                this.addStockTagToTheme(theme._id, stock._id)
                    .then(() => {
                        return this.createThemeStockComposition(theme, stock, user);
                    })
                    .then(themeStockComposition => {
                        return this.createStockAllocation(themeStockComposition, user, allocationData.exposure)
                    }).then(userThemeStockAllocation => {
                        activitylog.userThemeStockAllocation = userThemeStockAllocation;
                        return this.save(activitylog);
                    });
            })
        //TODO: add .catch? / error handling
    }

    addStockTagToTheme(themeId, stockId){
        return new Promise((resolve, reject) => {
            this.push(Theme, { _id: themeId }, { "stockTags": stockId })
            .then(() => {
                console.log("Stock tag added to theme.");
                resolve(true);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    removeStockTagFromTheme(themeStockCompositionID) {
        var that = this;
        return new Promise((resolve, reject) => {
            ThemeStockComposition.findById(themeStockCompositionID).then(function (themeStockComposition) {
                that.pull(Theme, { _id: themeStockComposition.theme }, { "stockTags": themeStockComposition.stock })
                    .then(() => {
                        console.log("Stock tag removed from theme.");
                        resolve(true);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            })
            .catch(err => reject(err));
        });
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

    getActivities(){
        var filter = { _id:0, user:1, theme:1,"userInput.categories":1, "userInput.categoriesValuesChecked":1, "userInput.timeHorizon":1, "userInput.maturity":1, "userInput.categoryValues":1};
        return new Promise((resolve, reject) => {
            ActivityLog.find({},filter).sort( { createdAt: -1 } ).exec()
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    getFollowThemeStatus(userId, themeId){
        return new Promise((resolve, reject) => {
            User.find({ _id:userId, follows: { $in : [themeId]}}).count()
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    followTheme(userId, themeId){
        return new Promise((resolve, reject) => {
            User.update( { "_id" : userId }, { "$addToSet" : { "follows" : themeId} } )
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    unFollowTheme(userId, themeId){
        return new Promise((resolve, reject) => {
            User.update( { "_id" : userId }, { "$pull" : { "follows" : themeId} } )
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    updateUserByEmail(userEmail, user){
        return new Promise((resolve, reject) => {
            User.update( {email: userEmail} , user)
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    getActivityByUser(userEmail){
        repo.getUserByEmail(userEmail)
        .then(user => {
            return new Promise((resolve, reject) => {
                ActivityLog.find( {userInput: user})
                    .then(results => {
                        resolve(results);
                    })
                    .catch(err => reject(err));
            });
        })
        .catch(err => next(err));
    }

    deleteActivityByUser(userEmail){
        repo.getUserByEmail(userEmail)
        .then(user => {
            return new Promise((resolve, reject) => {
                ActivityLog.remove( {userInput: user})
                    .then(results => {
                        resolve(results);
                    })
                    .catch(err => reject(err));
            });
        })
        .catch(err => next(err));
    }

    getNewsFeedByUserWithLimits(user, lowerLimit, upperLimit){
        var filter = { _id:0, user: 1, userName:1, theme: 1, themeName:1, userThemeInput:1, userThemeStockAllocation: 1, stock: 1, createdAt: 1};
        return new Promise((resolve, reject) => {
            ActivityLog.find({user: user}, filter).sort( { createdAt: -1 } ).skip(lowerLimit).limit(upperLimit)
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    getNewsFeedByThemesAUserFollowsWithLimits(user, lowerLimit, upperLimit){
        var filter = { _id:0, user: 1,userName:1, theme: 1, themeName:1, userThemeInput:1, userThemeStockAllocation: 1, stock: 1,createdAt: 1};
        return new Promise((resolve, reject) => {
            ActivityLog.find({ theme:  {$in: user.follows }}, filter).sort( { createdAt: -1 } ).skip(lowerLimit).limit(upperLimit)
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    //whether the user is admin or (probably logged in or not) should be checked in the controller and not here in the repo
    //make sure that the dates are in ISO() format e.g.ISODate("2017-07-04 15:46:11.976Z"),
    getNewsFeedByAdminUserBetweenDatesWithLimits(lowerDateLimit, upperDateLimit, lowerLimit, upperLimit){
        var filter = { _id:0, user: 1, userName:1, theme:1, themeName:1, userThemeInput:1, userThemeStockAllocation: 1, stock: 1,createdAt: 1};
        return new Promise((resolve, reject) => {
            ActivityLog.find({ createdAt: { $gte: lowerDateLimit, $lt: upperDateLimit}}, filter).sort( { createdAt: -1 } ).skip(lowerLimit).limit(upperLimit)
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    storeNewsFeedBasedOnStockAllocation(stockAllocation){
        let activityToBeLogged = new ActivityLog();
        activityToBeLogged.user = stockAllocation.user;
        activityToBeLogged.userThemeStockAllocation = stockAllocation;
        return this.getUserById(stockAllocation.user).then(user => {
            activityToBeLogged.userName = user.name;
            return this.getThemeStockCompositionById(stockAllocation.themeStockComposition);
        }).then(composition=>{
            stockAllocation.composition = composition;
            activityToBeLogged.theme = composition.theme;
            return this.getThemeById(composition.theme);
        }).then(theme=>{
            activityToBeLogged.themeName = theme.name;
            return this.getStockById(stockAllocation.composition.stock);
        }).then(stock=>{
            activityToBeLogged.stock = stock.companyName;
            return this.save(activityToBeLogged);
        });
    }


    storeNewsFeedBasedOnThemeProperties(user, theme, themeProperty){
        let activityToBeLogged = new ActivityLog();
        activityToBeLogged.user = user._id;
        activityToBeLogged.theme = theme._id;
        activityToBeLogged.userName = user.name;
        activityToBeLogged.themeName = theme.name;
        activityToBeLogged.userThemeInput = themeProperty;
        console.log(activityToBeLogged);
        return this.getUserById(user).then(user=>{
            activityToBeLogged.userName = user.name;
            return this.getThemeById(theme);
        }).then(theme=>{
            activityToBeLogged.themeName = theme.name;
            return this.save(activityToBeLogged);
        })
    }
}