import BaseRepository from './baseRepository';
var User = require('../models/user');
var Theme = require('../models/theme');
var mongoose = require('mongoose');
var AppError = require('../utilities/appError');
var UserThemeInput = require('../models/userThemeInput');
var ThemeStockComposition = require('../models/themeStockComposition');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var RegistrationAccessCode = require('../models/accessCode');

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
            }
            resolve(Theme.findById(id).populate('creator', 'name personalRole').exec());
        });
    }

    getThemePropertyById(id) {
        return new Promise((resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject(new AppError('Invalid Object Id', 400));
            }

            resolve(UserThemeInput.findById(id).populate('user', '_id').exec());
        });
    }

    getThemePropertyByThemeAndUser(themeId, userId) {
        return UserThemeInput.findOne({theme: themeId, user: userId}).exec();
    }

    getThemePropertiesByTheme(themeId) {
        return UserThemeInput.find({theme: themeId}, 'themeProperties').exec();
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
}