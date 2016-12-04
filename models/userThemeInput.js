var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');
var constants = require('./constants');

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    themePropertyInputs: [{
        property: { type: String, enum: [constants.THEME_PROPERTY_TIME_HORIZON, constants.THEME_PROPERTY_MATURITY, constants.THEME_PROPERTY_CATEGORY]},
        valueChosen: [{type: Number}]
        }],
    stocksAllocationInputs: []
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('UserThemeInput', schema);