var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constants = require('../utilities/constants');

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    themeProperties: {
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
        categories: [{
            type: Number,
            required: true,
            min: constants.MIN_CATEGORY,
            max: constants.MAX_CATEGORY
        }]
    }
});

module.exports = mongoose.model('UserThemeInput', schema);