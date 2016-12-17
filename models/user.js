var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var schema = new Schema({
    name: { type: String, required: true, minlength: 4},
    email: {
        type: String,
        required: [true, 'The email field is required'],
        unique: [true, 'The email you entered already exists'],
        validate: [ validator.isEmail, 'Invalid email syntax' ]
    },
    password: { type: String, required: [true, 'The password field is required'] },
    personalRole: { type: String, required: [true, 'The personal role field is required'] }
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('User', schema);