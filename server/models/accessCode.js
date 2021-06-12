import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';

const Schema = mongoose.Schema;
const schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 16,
        validate: [validator.isAlphanumeric, 'Invalid access code syntax']
    },
    validFrom: { type: Number, required: true, default: new Date().getTime() },
    validUntil: { type: Number, required: true, default: new Date(2025, 4, 1).getTime() }
});

//validUntil: "2017-04-30T22:00:00.000Z"
schema.plugin(mongooseUniqueValidator, { message: 'The {PATH} {VALUE} already exists' });
export default mongoose.model('RegistrationAccessCode', schema);