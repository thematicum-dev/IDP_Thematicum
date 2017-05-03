import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;

/* All types are array of numbers unlike UserThemeInput. Why?
Because lets say a theme is 33% accelerating and 33% mature, then it is both of type accelerating and mature.
*/

const schema = new Schema({
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    timeHorizon: {
        type: [Number],
        required: true,
        min: constants.MIN_TIME_HORIZON,
        max: constants.MAX_TIME_HORIZON
    },
    maturity: {
        type: [Number],
        required: true,
        min: constants.MIN_MATURITY,
        max: constants.MAX_MATURITY
    },
    categories: [{
        type: [Number],
        required: true,
        min: constants.MIN_CATEGORY,
        max: constants.MAX_CATEGORY
    }]
});

schema.index({theme: 1}, {unique: true});

export default mongoose.model('UserThemeInputAggregation', schema);