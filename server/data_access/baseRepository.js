import mongoose from 'mongoose';
import {AppError} from '../utilities/appError';

export default class BaseRepository {
    constructor() {}

    getById(collection, id) {
        return new Promise((resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject(new AppError('Invalid Object Id', 400));
            }

            resolve(collection.findById(id).exec());
        });
    }

    getAll(collection) {
        return collection.find({}).exec(); //returns promise
    }

    // .skip is slow for large values
    getRange(collection, start, limit){
          return new Promise((resolve, reject) => {
           collection.find().count().exec().then(count => {
                collection.find()
                .sort([['_id', -1]])
                .skip(start - 1).limit(limit).exec().then(result => {
                    const obj = { result: result, count: count};
                    resolve(obj);
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
    }

    save(document) {
        return document.save(); //returns promise
    }

    remove(document) {
        return document.remove();
    }

    removeById(collection, id) {
        return new Promise((resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject(new AppError('Invalid Object Id', 400));
            }

            resolve(collection.findByIdAndRemove(id).exec());
        });
    }
}