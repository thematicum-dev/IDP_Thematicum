import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';

const Schema = mongoose.Schema;
const schema = new Schema({
    email: {
        type: String,
        required: [true, 'The email field is required'],
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: [4, 'Email must have at least 4 letters'],
        maxlength: [32, 'Email must have at most 32 letters'],
        validate: [ validator.isEmail, 'Invalid email' ]
    }
});

schema.plugin(mongooseUniqueValidator, { message: 'The {PATH} {VALUE} already exists' });
export default mongoose.model('subscription', schema);