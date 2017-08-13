import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import constants from '../utilities/constants';

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
        type: String
    },
    CIK: {
        type: Number
    },
    SIC: {
        type: Number
    },
    businessDescription: {
        type: String
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
        type: String
    },
    reportingCurrency: {
        type: String
    },
    addedBy: { 
        type: Schema.Types.ObjectId, ref: 'User' 
    },
    investableInstrument:[{
        type: Number,
        min: constants.MIN_INVESTABLE_INSTRUMENT,
        max: constants.MAX_INVESTABLE_INSTRUMENT
    }]
});

schema.plugin(mongooseUniqueValidator);
export default mongoose.model('Stock', schema);