var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');
var bcrypt = require('bcryptjs');

var schema = new Schema({
    name: {
        type: String,
        required: [true, 'The user name field is required'],
        minlength: [4, 'User name must have at least 4 letters'],
        maxlength: [32, 'User name must have at most 32 letters']
    },
    email: {
        type: String,
        required: [true, 'The email field is required'],
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: [4, 'Email must have at least 4 letters'],
        maxlength: [32, 'Email must have at most 32 letters'],
        validate: [ validator.isEmail, 'Invalid email' ]
    },
    password: { type: String, required: [true, 'The password field is required'] },
    personalRole: {
        type: String,
        required: [true, 'The personal role field is required']
    }
});

schema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    let saltRounds = 10;
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

schema.methods.passwordIsValid = function(password) {
    return bcrypt.compareSync(password, this.password);
}

schema.plugin(mongooseUniqueValidator, { message: 'The {PATH} {VALUE} already exists' });
module.exports = mongoose.model('User', schema);