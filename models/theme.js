var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 32
    },
    tags: [{
        type: String,
        minlength: 3,
        maxlength: 16
    }],
    description: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 500
    },
    creator: {
        type: Schema.Types.ObjectId, ref: 'User'
    }}, { timestamps: true }) ;

schema.index({ name: 'text' });
schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('Theme', schema);