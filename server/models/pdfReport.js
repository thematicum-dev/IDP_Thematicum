
import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    displayLink: {
        type: String,
        required: true,
    },
    // TODO switch to url type
    link: {
        type: String,
        required: true,
        unique: true
    },
    snippet: {
        type: String,
        required: true,
    },
    relevancyRanking: {
        type: Number,
        required: true,
        default: 0
    },
    tfidfRanking: {
        type: Number,
        required: true,
        default: 0
    },
    userVoted: {
        type: Boolean,
        required: false
    },
    themeId: {
        type: String,
        required:true
    }}, { timestamps: true }) ;

schema.plugin(mongooseUniqueValidator, { message: 'The report already exists' });
export default mongoose.model('pdfReport', schema);
