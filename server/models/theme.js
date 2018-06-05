/*
The category, maturity and time horizon are aggreagted results from userThemeInput. They are used 
while searching a theme or stock i.e. filter by category, time horizon, maturity etc.
e.g. If theme is 30% Nascent, 60% Accelerating and 10% Mature as per user votes then
the theme is tagged as Accelerating. This aggregation is done for a theme every time any user visits
that theme's detail page.

Whenever an entry is made into themeStockComposition, that stock is added here in StockTags. Whenever
an entry is removed from themeStockComposition, that stock is removed from the StockTags. The StockTags
are required to search by stock while filtering by category, time horizon or maturity.
*/
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
    geography:[{
        type: Number,
        minlength: 4,
        maxlength: 32,
        min: constants.MIN_GEOGRAPHY,
        max: constants.MAX_GEOGRAPHY
    }],
    creator: {
        type: Schema.Types.ObjectId, ref: 'User'
    }}, { timestamps: true }) ;

schema.index({ name: 'text', description: 'text', tags: 'text' });
schema.plugin(mongooseUniqueValidator, { message: 'The {PATH} \'{VALUE}\' already exists' });
export default mongoose.model('Theme', schema);