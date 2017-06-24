import mongoose from 'mongoose';
import {AppError} from '../utilities/appError';
import QueryBuilder from './queryBuilder';

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
        return collection.find({}).exec();
    }

    getRange(collection, start, limit){
          return new Promise((resolve, reject) => {        
            (new QueryBuilder()).selectModel(collection).findAll().count().exec().then(count => {
                (new QueryBuilder()).selectModel(collection).findAll().sortDescending().skip(start, limit).exec().then(result => {
                    const obj = { result: result, count: count};
                    resolve(obj);
                })
                .catch(err => reject (err));
            })
            .catch(err => reject (err)); 
        });
    }

    save(document) {
        return document.save(); 
    }

    // adds a new document if none is found because of upsert:true
    update(collection, query, update) {
        return collection.update(query, update,  {upsert: true}); 
    }

    // adds a value to an array from collection where a query is satisfied
    push(collection, query, push) {
        return new Promise((resolve, reject) => {
            collection.update(query, { $push: push },  {upsert: true})
                .then(() => resolve(true))
                .catch(err => reject(err));
        });
    }

    // removes a value from an array from collection where a query is satisfied
    pull(collection, query, pull) {
        return new Promise((resolve, reject) => {
            collection.update(query, { $pull: pull })
                .then(() => {
                    resolve(true)
                })
                .catch(err => {
                    reject(err)
                });
        });
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