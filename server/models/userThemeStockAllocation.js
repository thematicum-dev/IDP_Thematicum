/* 
stores all raw user votes for assigned stocks to a theme.
*/
import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    themeStockComposition: { type: Schema.Types.ObjectId, ref: 'ThemeStockComposition' },
    exposure: {
        type: Number,
        required: true,
        min: constants.MIN_EXPOSURE,
        max: constants.MAX_EXPOSURE
    }
});

export default mongoose.model('UserThemeStockAllocation', schema);