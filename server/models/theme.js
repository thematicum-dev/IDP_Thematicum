import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;
const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: 4,
        maxlength: 32
    },
    tags: [{
        type: String,
        minlength: 4,
        maxlength: 32
    }],
    description: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: 4,
        maxlength: 500
    },
    stockTags: [{
        type: Schema.Types.ObjectId, 
        ref: 'Stock'
    }],
    categories:[{
        type: Number,
        minlength: 4,
        maxlength: 32,
        min: constants.MIN_CATEGORY,
        max: constants.MAX_CATEGORY
    }],  
    timeHorizon:[{
        type: Number,
        minlength: 4,
        maxlength: 32,
        min: constants.MIN_TIME_HORIZON,
        max: constants.MAX_TIME_HORIZON
    }],
    maturity:[{
        type: Number,
        minlength: 4,
        maxlength: 32,
        min: constants.MIN_MATURITY,
        max: constants.MAX_MATURITY
    }],  
    creator: {
        type: Schema.Types.ObjectId, ref: 'User'
    }}, { timestamps: true }) ;

schema.index({ name: 'text', description: 'text', tags: 'text' });
schema.plugin(mongooseUniqueValidator, { message: 'The {PATH} \'{VALUE}\' already exists' });
export default mongoose.model('Theme', schema);