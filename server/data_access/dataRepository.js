import mongoose from 'mongoose';
import BaseRepository from './baseRepository';
import QueryBuilder from './queryBuilder';
import User from '../models/user';
import Theme from '../models/theme';
import ActivityLog from '../models/activitylog';
import RealtimeNews from '../models/realtimeNews';
import UserNewsRelevancyVote from '../models/userNewsRelevancyVote';
import UserReportRelevancyVote from '../models/userReportRelevancyVote';
import CustomSearch from '../models/customSearchReport';
import {AppError} from '../utilities/appError';
import UserThemeInput from '../models/userThemeInput';
import ThemeStockComposition from '../models/themeStockComposition';
import UserThemeStockAllocation from '../models/userThemeStockAllocation';
import ThemeFundComposition from '../models/themeFundComposition';
import UserThemeFundAllocation from '../models/userThemeFundAllocation';
import RegistrationAccessCode from '../models/accessCode';
import Subscription from '../models/subscription';
import Stock from '../models/stock';
import Fund from '../models/fund';
import { ThemePropertiesAggregation, StockAllocationAggregation, FundAllocationAggregation } from '../utilities/dataAggregation';

import constants from '../utilities/constants';

export default class DataRepository extends BaseRepository {
    constructor() {
        super();
    }

    // TODO: Refactor this class into separate classes

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

    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.getAll(User)
                .then(results => {
                    resolve(results)
                })
                .catch(err => reject(err));
        })
    }

    getUserByPasswordExpiry(token,expiry) {
        console.log("expirty vitra yo");
        return new Promise((resolve, reject) => {
            User.findOne({resetPasswordToken: token, resetPasswordExpires: expiry}).exec()
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

    getAllThemes() {
        return new Promise((resolve, reject) => {
            Theme.find({}).exec()
                .then((res) =>{
                    if (!res) {
                        reject("No report found.");
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        })
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

    getThemeByUserThemeQueryPagination(start, limit, searchQuery, categories, maturity, timeHorizon, geography, sectors, tags) {
        let countPromise = this.getThemeByUserThemeQuery(searchQuery, categories, maturity, timeHorizon, geography, sectors, tags)
            .count().exec();

        let resultPromise = this.getThemeByUserThemeQuery(searchQuery, categories, maturity, timeHorizon, geography, sectors, tags)
            .skip(start - 1).limit(limit).exec();

        return new Promise((resolve, reject) => {
            Promise.all([countPromise, resultPromise])
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        }).catch(err => reject(err));
    }

     getThemeByUserStockQueryPagination(start, limit, stockId, categories, maturity, timeHorizon, geography, sectors, tags) {
        let countPromise = this.getThemeByUserStockQuery(stockId, categories, maturity, timeHorizon, geography, sectors, tags)
            .count().exec();

        let resultPromise = this.getThemeByUserStockQuery(stockId, categories, maturity, timeHorizon, geography, sectors, tags)
            .skip(start - 1).limit(limit).exec();

        return new Promise((resolve, reject) => {
            Promise.all([countPromise, resultPromise])
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        }).catch(err => reject(err));
    }

    getThemeByUserThemeQuery(searchQuery, categories, maturity, timeHorizon, geography, sectors, tags) {
        let andQuery = [];

        if (searchQuery !== undefined && searchQuery.length > 0)
            andQuery.push({ $text: { $search: searchQuery } });

        if (categories !== undefined && categories.length > 0)
            andQuery.push({ categories: { "$in": categories } });

        if (maturity !== undefined && maturity.length > 0)
            andQuery.push({ maturity: { "$in": maturity } });

        if (timeHorizon !== undefined && timeHorizon.length > 0)
            andQuery.push({ timeHorizon: { "$in": timeHorizon } });

        if (geography !== undefined && geography.length > 0)
            andQuery.push({ geography: { "$in": geography } });

        if (sectors !== undefined && sectors.length > 0)
            andQuery.push({ sectors: { "$in": sectors } });

        if (tags !== undefined && tags.length > 0)
            andQuery.push({ tags: { "$in": tags } });

        if (andQuery.length != 0) {
            return Theme.find({ $and: andQuery });
        } else {
            return Theme.find({});
        }
    }

     getThemeByUserStockQuery(stockId, categories, maturity, timeHorizon, geography, sectors, tags) {
        let andQuery = [];

        if (stockId !== undefined && stockId.length > 0)
            andQuery.push({ stockTags: { "$in": [stockId] } });

        if (categories !== undefined && categories.length > 0)
            andQuery.push({ categories: { "$in": categories } });

        if (maturity !== undefined && maturity.length > 0)
            andQuery.push({ maturity: { "$in": maturity } });

        if (timeHorizon !== undefined && timeHorizon.length > 0)
            andQuery.push({ timeHorizon: { "$in": timeHorizon } });

         if (geography !== undefined && geography.length > 0)
             andQuery.push({ geography: { "$in": geography } });

         if (sectors !== undefined && sectors.length > 0)
             andQuery.push({ sectors: { "$in": sectors } });

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
                    const obj = {themeId: themeId, properties: themeProperties, userInputs: themePropertiesByCurrentUser, totalCount: totalCount};

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

    notExistFundAllocationsForThemeFundComposition(compositionId) {
        return new Promise((resolve, reject) => {
            UserThemeFundAllocation.find({themeFundComposition: compositionId}).exec()
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
        //themeStockComposition : ThemeStockComposition;
        let stockComposition = ThemeStockComposition.find({theme: themeId})
            .populate('stock', 'companyName country')
            .exec();
        console.log(stockComposition);

        return stockComposition;
    }

    getThemeFundCompositionsByTheme(themeId) {
        return ThemeFundComposition.find({theme: themeId})
            .populate('fund', 'fundName foundIsin')
            .exec();
    }

    getThemeStockCompositionById(id){
        return new Promise((resolve, reject) => {
            ThemeStockComposition.findOne({_id: id}).exec().then(composition =>{
                resolve(composition)
            }).catch(err => reject(err));
        });
    }

    getThemeFundCompositionById(id){
        return new Promise((resolve, reject) => {
            ThemeFundComposition.findOne({_id: id}).exec().then(composition =>{
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

    getFundById(id){
        return new Promise((resolve, reject) => {
            Fund.findOne({_id: id}).exec().then(fund =>{
                resolve(fund)
            }).catch(err => reject(err));
        });
    }

    nextStockSeqNr(){
        return new Promise((resolve,reject) => {
            Stock.find().sort({_id:-1}).limit(1).exec().then(stock =>{
                resolve(parseInt(stock[0].seqNr,10)+1);
            }).catch(err => reject (err));
        });
    }

    nextFundSeqNr(){
        return new Promise((resolve,reject) => {
            Fund.find().sort({_id:-1}).limit(1).exec().then(fund =>{
                resolve(parseInt(fund[0].seqNr,10)+1);
            }).catch(err => reject (err));
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

    getFundAllocationsByThemeFundComposition(themeFundComposition, currentUserId) {
        return new Promise((resolve, reject) => {
            UserThemeFundAllocation.find({themeFundComposition: themeFundComposition._id}).exec()
                .then(allocations => {
                    //aggregation
                    const fundAllocationAggregation = new FundAllocationAggregation();
                    const aggregation = fundAllocationAggregation.getDataAggregation(allocations);
                    const totalCount = allocations ? allocations.length : 0;

                    const fundAllocationByCurrentUser = this.getFundAllocationByUser(allocations, currentUserId);

                    const obj = {themeFundComposition: themeFundComposition, exposures: aggregation.exposure, userFundAllocation: fundAllocationByCurrentUser, totalCount: totalCount};
                    resolve(obj);
                })
                .catch(err => reject(err));
        });
    }

    deleteAllStockAllocationsByCompositionId(compositionId){
        return Promise.all([UserThemeStockAllocation.remove({ themeStockComposition: compositionId }).exec()]); 
    }

    deleteUserById(userId) {
        return Promise.all([User.remove({ _id: userId }).exec()]);
    }

    deleteStockCompositionById(compositionId){
        return Promise.all([ThemeStockComposition.remove({_id: compositionId }).exec(), UserThemeStockAllocation.remove({ themeStockComposition: compositionId }).exec()]);
    }

    deleteFundCompositionById(compositionId){
        return Promise.all([ThemeFundComposition.remove({_id: compositionId }).exec(), UserThemeFundAllocation.remove({ themeFundComposition: compositionId }).exec()]);
    }

    deleteAllStockCompositionsByThemeId(themeId){
        const deleteStocksPromise = ThemeStockComposition.find({ theme: themeId }).exec()
            .then(compositions => {
                compositions.map(composition => {
                    return Promise.all([this.remove(composition), UserThemeStockAllocation.remove({ themeStockComposition: composition._id }).exec()]);
                });
            });
    }

    deleteAllFundCompositionsByThemeId(themeId){
        const deleteFundsPromise = ThemeFundComposition.find({ theme: themeId }).exec()
            .then(compositions => {
                compositions.map(composition => {
                    return Promise.all([this.remove(composition), UserThemeFundAllocation.remove({ themeFundComposition: composition._id }).exec()]);
                });
            });
    }

    deleteAllStockCompositionsByStockId(stockId){
        const deleteStocksPromise = ThemeStockComposition.find({ stock: stockId }).exec()
            .then(compositions => {
                compositions.map(composition => {
                    return Promise.all([this.remove(composition), UserThemeStockAllocation.remove({ themeStockComposition: composition._id }).exec()]);
                });
            });
    }

    deleteAllFundCompositionsByFundId(fundId){
        const deleteFundsPromise = ThemeFundComposition.find({ fund: fundId }).exec()
            .then(compositions => {
                compositions.map(composition => {
                    return Promise.all([this.remove(composition), UserThemeFundAllocation.remove({ themeFundComposition: composition._id }).exec()]);
                });
            });
    }

    deleteAllUserThemeInputsByThemeId(themeId){
        return UserThemeInput.remove({theme: themeId}).exec(); 
    }

    removeAllUserFollowersByThemeId(themeId){
        return User.update(
            { },
            { $pull: {follows: themeId} },
            { multi: true }
        );
    }

    getStockAllocationByUser(allocations, userId) {
        return allocations.find(allocation => allocation.user == userId);
    }

    getFundAllocationByUser(allocations, userId) {
        return allocations.find(allocation => allocation.user == userId);
    }

    deleteThemeData(theme) {
        const deleteAllStockCompositionsPromise = this.deleteAllStockCompositionsByThemeId(theme.id);
        const deleteAllFundCompositionsPromise = this.deleteAllFundCompositionsByThemeId(theme.id);
        const deleteAllUserThemeInputsPromise = this.deleteAllUserThemeInputsByThemeId(theme.id);
        const removeAllUserFollowersPromise = this.removeAllUserFollowersByThemeId(theme.id);
        const deleteThemePromise = this.remove(theme); 
        return Promise.all([deleteAllStockCompositionsPromise, deleteAllFundCompositionsPromise, deleteAllUserThemeInputsPromise, removeAllUserFollowersPromise, deleteThemePromise]);
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
                        var followPromise = this.followTheme(activitylog.user, activitylog.theme);
                        var savePromise = this.save(activitylog);
                        return Promise.all([followPromise, savePromise]);
                        //return this.save(activitylog);
                    });
            })
        //TODO: add .catch? / error handling
    }

    createFundCompositionAndAllocation(allocationData, theme, user) {
        let activitylog = new ActivityLog();
        activitylog.user = user._id;
        activitylog.theme = theme._id;
        activitylog.userName = user.name;
        activitylog.themeName = theme.name;
        return this.getById(Fund, allocationData.fundId)
            .then(fund => {
                activitylog.fund = fund.fundName;
                this.addFundTagToTheme(theme._id, fund._id)
                    .then(() => {
                        return this.createThemeFundComposition(theme, fund, user);
                    })
                    .then(themeFundComposition => {
                        return this.createFundAllocation(themeFundComposition, user, allocationData.exposure)
                    }).then(userThemeFundAllocation => {
                    activitylog.userThemeFundAllocation = userThemeFundAllocation;
                    var followPromise = this.followTheme(activitylog.user, activitylog.theme);
                    var savePromise = this.save(activitylog);
                    return Promise.all([followPromise, savePromise]);
                    //return this.save(activitylog);
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

    addEmailToSubscription(emailID) {

        console.log("subscription save huna ayo hai");
        const subscribe = new Subscription({

            email: emailID
        });

        this.save(subscribe);
    }

    addFundTagToTheme(themeId, fundId){
        return new Promise((resolve, reject) => {
            this.push(Theme, { _id: themeId }, { "fundTags": fundId })
                .then(() => {
                    console.log("Fund tag added to theme.");
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

    removeFundTagFromTheme(themeFundCompositionID) {
        var that = this;
        return new Promise((resolve, reject) => {
            ThemeFundComposition.findById(themeFundCompositionID).then(function (themeFundComposition) {
                that.pull(Theme, { _id: themeFundComposition.theme }, { "fundTags": themeFundComposition.fund })
                    .then(() => {
                        console.log("Fund tag removed from theme.");
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

    createThemeFundComposition(theme, fund, user) {
        const themeFundComposition = new ThemeFundComposition({
            theme: theme,
            fund: fund,
            addedBy: user
        });

        return this.save(themeFundComposition);
    }

    createStockAllocation(themeStockComposition, user, exposure) {
        const stockAllocation = new UserThemeStockAllocation({
            user: user,
            themeStockComposition: themeStockComposition,
            exposure: exposure
        });

        return this.save(stockAllocation);
    }

    createFundAllocation(themeFundComposition, user, exposure) {
        const fundAllocation = new UserThemeFundAllocation({
            user: user,
            themeFundComposition: themeFundComposition,
            exposure: exposure
        });

        return this.save(fundAllocation);
    }

    getActivities(){
        var filter = { _id:0, user:1, theme:1,"userInput.categories":1, "userInput.categoriesValuesChecked":1, "userInput.timeHorizon":1, "userInput.maturity":1, "userInput.geography":1, "userInput.sectors":1, "userInput.categoryValues":1};
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
        var filter = { _id:0, user: 1, userName:1, theme: 1, themeName:1, userThemeInput:1, userThemeStockAllocation: 1, stock: 1, userThemeFundAllocation: 1, fund: 1, createdAt: 1};
        return new Promise((resolve, reject) => {
            ActivityLog.find({user: user}, filter).sort( { createdAt: -1 } ).skip(lowerLimit).limit(upperLimit)
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    getNewsFeedByThemesAUserFollowsWithLimits(user, lowerLimit, upperLimit){
        var filter = { _id:0, user: 1,userName:1, theme: 1, themeName:1, userThemeInput:1, userThemeStockAllocation: 1, stock: 1, userThemeFundAllocation: 1, fund: 1, createdAt: 1};
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
        var filter = { _id:0, user: 1, userName:1, theme:1, themeName:1, userThemeInput:1, userThemeStockAllocation: 1, stock: 1, userThemeFundAllocation: 1, fund: 1,createdAt: 1};
        return new Promise((resolve, reject) => {
            ActivityLog.find({ createdAt: { $gte: lowerDateLimit, $lte: upperDateLimit}}, filter).sort( { createdAt: -1 } ).skip(lowerLimit).limit(upperLimit)
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
            var savePromise = this.save(activityToBeLogged);
            var followPromise = this.followTheme(activityToBeLogged.user, activityToBeLogged.theme);
            return Promise.all([savePromise, followPromise]);
            //return this.save(activityToBeLogged);
        });
    }

    storeNewsFeedBasedOnFundAllocation(fundAllocation){
        let activityToBeLogged = new ActivityLog();
        activityToBeLogged.user = fundAllocation.user;
        activityToBeLogged.userThemeFundAllocation = fundAllocation;
        return this.getUserById(fundAllocation.user).then(user => {
            activityToBeLogged.userName = user.name;
            return this.getThemeFundCompositionById(fundAllocation.themeFundComposition);
        }).then(composition=>{
            fundAllocation.composition = composition;
            activityToBeLogged.theme = composition.theme;
            return this.getThemeById(composition.theme);
        }).then(theme=>{
            activityToBeLogged.themeName = theme.name;
            return this.getFundById(fundAllocation.composition.fund);
        }).then(fund=>{
            activityToBeLogged.fund = fund.fundName;
            var savePromise = this.save(activityToBeLogged);
            var followPromise = this.followTheme(activityToBeLogged.user, activityToBeLogged.theme);
            return Promise.all([savePromise, followPromise]);
            //return this.save(activityToBeLogged);
        });
    }


    storeNewsFeedBasedOnThemeProperties(user, theme, themeProperty){
        let activityToBeLogged = new ActivityLog();
        activityToBeLogged.user = user;
        activityToBeLogged.theme = theme;
        activityToBeLogged.userName = user.name;
        activityToBeLogged.themeName = theme.name;
        activityToBeLogged.userThemeInput = themeProperty;
        return this.getUserById(user).then(user=>{
            activityToBeLogged.userName = user.name;
            return this.getThemeById(theme);
        }).then(theme=>{
            activityToBeLogged.themeName = theme.name;
            var followPromise = this.followTheme(activityToBeLogged.user, theme._id);
            var savePromise = this.save(activityToBeLogged);
            return Promise.all([followPromise, savePromise]);
            //return this.save(activityToBeLogged);
        })
    }

    getThemesAUserFollows(user){
        return new Promise((resolve, reject) => {
            Theme.find({ _id:  {$in: user.follows }})
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    validateStockComposition(compositionId, validation){
        return new Promise ((resolve,reject) => {
            this.update(ThemeStockComposition, { "_id" : compositionId }, {"isValidated": validation})
            .then(results => {
                resolve(results);
            })
            .catch(err => reject(err));
        });
    }

    validateFundComposition(compositionId, validation){
        return new Promise ((resolve,reject) => {
            this.update(ThemeFundComposition, { "_id" : compositionId }, {"isValidated": validation})
                .then(results => {
                    resolve(results);
                })
                .catch(err => reject(err));
        });
    }

    deleteStockById(stockId){
        const deleteAllStockCompositionsPromise = this.deleteAllStockCompositionsByStockId(stockId);
        const deleteStock = this.removeById(Stock,stockId);
        return Promise.all([deleteAllStockCompositionsPromise, deleteStock]);
    }

    getRealtimeNewsByThemeIdFor6Months(themeId) {
        return new Promise ((resolve, reject) => {
            let d = new Date();
            d.setMonth(d.getMonth() - 6);
            RealtimeNews.find({themeId: themeId, publishedAt: {$gte: d}}).exec()
                .then((res) => {

                    if (!res) {
                        reject("No news found.");
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getVotedNewsByThemeId(themeId) {
        return new Promise ((resolve, reject) => {
            RealtimeNews.find({themeId: themeId, relevancyRanking: { $gt: 0 }}).exec()
                .then((res) => {

                    // console.log(res);

                    if (!res) {
                        reject("No news found.");
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getNewsWith0VoteByUrl(url) {
        return new Promise ((resolve, reject) => {
            RealtimeNews.find({url: url, relevancyRanking: 0}).exec()
                .then((res) => {

                    // console.log(res);

                    if (!res) {
                        reject("No news found.");
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getRealtimeNewsById(newsId) {
        return new Promise ((resolve, reject) => {
            RealtimeNews.findById(newsId).exec()
                .then((res) => {

                    if (!res) {
                        reject("No news found with this id.");
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    increaseNewsRelevancyBy10(newsId) {
       return new Promise ((resolve, reject) => {
            RealtimeNews.findById(newsId, function (err, news) {
                if (err) return handleError(err);

                let newRanking = news.relevancyRanking + 10;
                news.set({ relevancyRanking: newRanking });
                news.save(function (err, updatedNews) {
                    if (err) reject(err);
                    resolve(updatedNews);
                })
            });
       });
    }

    setUserRelevancyVote(userId, newsId) {
        return new Promise((resolve, reject) => {
            let newsUserComposition = new UserNewsRelevancyVote({user: userId, news: newsId, relevant: true});

            newsUserComposition.save(function (err) {
                if (err) reject(err);

                resolve(err);
            })
        })
    }

    getUserVotedNews(userId) {
        return new Promise((resolve, reject) => {
            UserNewsRelevancyVote.find({user: userId, relevant: true}).exec()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getUserVotedReports(userId) {
        return new Promise((resolve, reject) => {
            UserReportRelevancyVote.find({user: userId, relevant: true}).exec()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    setTFIDFReportRanking(ranking) {
        return new Promise((resolve, reject) => {
            console.log(ranking);

            CustomSearch.findById(ranking.id, function (err, report) {

                // let newRanking = report.relevancyRanking + ranking.measure;
                report.set({ tfidfRanking: ranking.measure });
                report.save(function (err, updatedReport) {
                    console.log("Ranking changed.");
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    resolve(updatedReport);
                })
            });
        });
    }


    toggleUserRelevancyVoteForNews(userId, newsId) {
        return new Promise((resolve, reject) => {
            UserNewsRelevancyVote.find({user: userId, news: newsId}).exec()
                .then((res) => {
                    // console.log(res[0]._id);
                    if (!res.length) {
                        // Vote does not exist yet
                        let newsUserComposition = new UserNewsRelevancyVote({user: userId, news: newsId, relevant: true});
                        newsUserComposition.save(function (err, success) {
                            console.log("New user composition saved.");
                            if (err) reject(err);
                        });
                        RealtimeNews.findById(newsId, function (err, news) {
                            let newRanking = news.relevancyRanking + 10;
                            news.set({ relevancyRanking: newRanking });
                            news.save(function (err, updatedNews) {
                                console.log("Ranking increased.");
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                }
                                resolve(updatedNews);
                            })
                        });
                    }
                    else {
                        // vote exists already
                        if (res[0].relevant) {
                            RealtimeNews.findById(newsId, function (err, news) {
                                //if (err) return handleError(err);
                                let newRanking = news.relevancyRanking - 10;
                                news.set({ relevancyRanking: newRanking });
                                news.save(function (err, updatedNews) {
                                    console.log("Updated ranking saved.");
                                    if (err) reject(err);
                                })
                            });
                            UserNewsRelevancyVote.findById(res[0]._id, function (err, vote) {
                                vote.set({relevant: false});
                                vote.save(function (err, newVote) {
                                    resolve(newVote);
                                });
                            });
                        } else {
                            RealtimeNews.findById(newsId, function (err, news) {
                                let newRanking = news.relevancyRanking + 10;
                                news.set({ relevancyRanking: newRanking });
                                news.save(function (err, updatedNews) {
                                    if (err) reject(err);
                                })
                            });

                            UserNewsRelevancyVote.findById(res[0]._id, function (err, vote) {
                                vote.set({relevant: true});
                                vote.save(function (err, newVote) {
                                    resolve(newVote);
                                });
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log("failed");
                    console.log(err);
                    reject(err);
                });
        })
    }



    toggleUserRelevancyVoteForReport(userId, reportId) {
        return new Promise((resolve, reject) => {
            UserReportRelevancyVote.find({user: userId, report: reportId}).exec()
                .then((res) => {
                    // console.log(res[0]._id);
                    if (!res.length) {
                        // Vote does not exist yet
                        let newsUserComposition = new UserReportRelevancyVote({user: userId, report: reportId, relevant: true});
                        newsUserComposition.save(function (err, success) {
                            // console.log("New user composition saved.");
                            if (err) reject(err);
                        });
                        CustomSearch.findById(reportId, function (err, report) {
                            let newRanking = report.relevancyRanking + 10;
                            report.set({ relevancyRanking: newRanking });
                            report.save(function (err, updatedReport) {
                                console.log("Ranking increased.");
                                if (err) reject(err);
                                resolve(updatedReport);
                            })
                        });
                    }
                    else {
                        // vote exists already
                        if (res[0].relevant) {
                            CustomSearch.findById(reportId, function (err, report) {
                                let newRanking = report.relevancyRanking - 10;
                                report.set({ relevancyRanking: newRanking });
                                report.save(function (err, updatedReport) {
                                    console.log("Updated ranking saved.");
                                    if (err) reject(err);
                                })
                            });
                            UserReportRelevancyVote.findById(res[0]._id, function (err, vote) {
                                vote.set({relevant: false});
                                vote.save(function (err, newVote) {
                                    resolve(newVote);
                                });
                            });
                        } else {
                            CustomSearch.findById(reportId, function (err, report) {
                                let newRanking = report.relevancyRanking + 10;
                                report.set({ relevancyRanking: newRanking });
                                report.save(function (err, updatedReport) {
                                    if (err) reject(err);
                                })
                            });

                            UserReportRelevancyVote.findById(res[0]._id, function (err, vote) {
                                vote.set({relevant: true});
                                vote.save(function (err, newVote) {
                                    resolve(newVote);
                                });
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log("failed");
                    reject(err);
                });
        })
    }


    getReportsByThemeId(themeId) {
        return new Promise ((resolve, reject) => {
            CustomSearch.find({themeId: themeId}).exec()
                .then((res) => {

                    if (!res) {
                        reject("No report found.");
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getReportById(reportId) {
        return new Promise ((resolve, reject) => {
            CustomSearch.findById(reportId).exec()
                .then((res) => {

                    if (!res) {
                        reject("No report found with this id.");
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getAllReports() {
        return new Promise((resolve, reject) => {
            CustomSearch.find({}).exec()
                .then((res) => {
                    if (!res) {
                        reject("No reports found.")
                    }

                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    removeReportById(id) {
        return new Promise((resolve, reject) => {
            CustomSearch.findByIdAndRemove(id).exec()
                .then(() => resolve())
                .catch(() => reject());
        });
    }

    getAllNews() {
        return new Promise((resolve, reject) => {
            RealtimeNews.find({}).exec()
                .then((res) => {
                    if (!res) {
                        reject("No news found.")
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    removeNewsById(id) {
        return new Promise((resolve, reject) => {
            RealtimeNews.findByIdAndRemove(id).exec()
                .then(() => resolve())
                .catch(() => reject());
        });
    }

    deleteFundById(fundId){
        const deleteAllFundCompositionsPromise = this.deleteAllFundCompositionsByFundId(fundId);
        const deleteFund = this.removeById(Fund,fundId);
        return Promise.all([deleteAllFundCompositionsPromise, deleteFund]);
    }
}
