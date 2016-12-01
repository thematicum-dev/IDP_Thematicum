var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    themePropertyInputs: [{type: Schema.Types.ObjectId, ref: 'ThemePropertyInput'}],
    stocksAllocationInputs: []
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('UserThemeInput', schema);