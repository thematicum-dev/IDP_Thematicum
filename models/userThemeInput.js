var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');
var constants = require('./constants');

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    themeProperties: {
        timeHorizon: { type: Number },
        maturity: { type: Number },
        categories: [{ type: Number }]
        },
    stocksAllocationInputs: []
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('UserThemeInput', schema);