var mongoose = require('mongoose');
var AppError = require('../utilities/appError');

export default class BaseRepository {
    constructor() {}

    getById(collection, id) {
        return new Promise((resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject(new AppError('Invalid Object Id', 400));
            }

            resolve(collection.findById(id).exec())
        });
    }

    getAll(collection) {
        return collection.find({}).exec(); //returns promise
    }

    save(document) {
        return document.save(); //returns a promise
    }

    remove(document) {
        return document.remove();
    }
}