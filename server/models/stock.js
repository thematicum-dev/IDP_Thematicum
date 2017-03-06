import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const schema = new Schema({
    seqNr: {
        type: Number,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    ticker: {
        type: String,
        required: true,
        unique: true
    },
    CIK: {
        type: Number,
        required: true
    },
    SIC: {
        type: Number,
        required: true
    },
    businessDescription: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    exchange: {
        type: String,
        required: true
    },
    reportingCurrency: {
        type: String,
        required: true
    }
});

schema.plugin(mongooseUniqueValidator);
export default mongoose.model('Stock', schema);