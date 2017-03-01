import BaseRepository from './baseRepository';
var User = require('../models/user');
var Theme = require('../models/theme');
var mongoose = require('mongoose');
var AppError = require('../utilities/appError');
var UserThemeInput = require('../models/userThemeInput');
var ThemeStockComposition = require('../models/themeStockComposition');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');

export default class DataRepository extends BaseRepository {
    constructor() {
        super();
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