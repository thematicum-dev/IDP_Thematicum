var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 16,
        validate: [validator.isAlphanumeric, 'Invalid access code syntax']
    },
    validFrom: { type: Number, required: true, default: new Date().getTime() },
    validUntil: { type: Number, required: true, default: new Date(2017, 4, 1).getTime() }
});

//validUntil: "2017-04-30T22:00:00.000Z"
schema.plugin(mongooseUniqueValidator, { message: 'The {PATH} {VALUE} already exists' });
module.exports = mongoose.model('RegistrationAccessCode', schema);