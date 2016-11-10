var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    tagsAndRelatedThemes: {
        type: String
    },
    description: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    timeHorizon: {
        type: String
    },
    maturity: {
        type: String
    },
    categories: {
        type: String
    }
});

schema.index({ name: 'text' });
schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('Theme', schema);