var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var constants = require('./constants');
var validator = require('validator');

var schema = new Schema({
    property: { type: String, enum: [constants.THEME_PROPERTY_TIME_HORIZON, constants.THEME_PROPERTY_MATURITY, constants.THEME_PROPERTY_CATEGORY]},
    valueChosen: [{type: String}]
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('ThemePropertyInput', schema);