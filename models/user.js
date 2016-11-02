var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var schema = new Schema({
    name: { type: String, required: true, minlength: 4},
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [ validator.isEmail, 'Invalid email syntax' ]
    },
    password: { type: String, required: true },
    personalRole: { type: String, required: true }
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('User', schema);