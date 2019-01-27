import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const schema = new Schema({
    source: {
        type: String,
        required: true,
    },
    author: {
        type: String
    },
    // TODO switch to url type
    url: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    urlToImage: {
        type: String
    },
    publishedAt: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    description: {
        type: String,
        required: true,
    },
    relevancyRanking: {
        type: Number,
        required: true,
        default: 0
    },
    userUpVoted: {
        type: Boolean,
        required: false
    },
    userDownVoted: {
        type: Boolean,
        required: false
    },
    themeId: {
        type: String,
        required:true
    }}, { timestamps: true }) ;

schema.plugin(mongooseUniqueValidator, { message: 'The news already exists' });
export default mongoose.model('news', schema);