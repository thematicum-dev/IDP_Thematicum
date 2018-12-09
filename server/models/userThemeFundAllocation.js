/*
stores all raw user votes for assigned funds to a theme.
*/
import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    themeFundComposition: { type: Schema.Types.ObjectId, ref: 'ThemeFundComposition' },
    exposure: {
        type: Number,
        required: true,
        min: constants.MIN_EXPOSURE,
        max: constants.MAX_EXPOSURE
    }
}, { timestamps: true });

export default mongoose.model('UserThemeFundAllocation', schema);