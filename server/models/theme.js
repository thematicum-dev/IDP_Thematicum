import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: 4,
        maxlength: 32
    },
    tags: [{
        type: String,
        minlength: 4,
        maxlength: 32
    }],
    description: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: 4,
        maxlength: 500
    },
    creator: {
        type: Schema.Types.ObjectId, ref: 'User'
    }}, { timestamps: true }) ;

schema.index({ name: 'text' });
schema.plugin(mongooseUniqueValidator, { message: 'The {PATH} \'{VALUE}\' already exists' });
export default mongoose.model('Theme', schema);