/* 
stores all raw user votes for theme characteristics.
*/
import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    timeHorizon: {
        type: Number,
        required: true,
        min: constants.MIN_TIME_HORIZON,
        max: constants.MAX_TIME_HORIZON
    },
    maturity: {
        type: Number,
        required: true,
        min: constants.MIN_MATURITY,
        max: constants.MAX_MATURITY
    },
    geography: {
        type: Number,
        required: true,
        min: constants.MIN_GEOGRAPHY,
        max: constants.MAX_GEOGRAPHY
    },
    categories: [{
        type: Number,
        required: true,
        min: constants.MIN_CATEGORY,
        max: constants.MAX_CATEGORY
    }]
});

export default mongoose.model('UserThemeInput', schema);