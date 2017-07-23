import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;
const UserThemeInputSchema = mongoose.model('UserThemeInput').schema;
const UserThemeStockAllocation = mongoose.model('UserThemeStockAllocation').schema;
const Stock = mongoose.model('Stock').schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme', index: true },
    userThemeInput: { type: UserThemeInputSchema, default: null },
    userThemeStockAllocation: { type: UserThemeStockAllocation, default: null },
    stock: {type: String, default: null},
    createdAt : { type : Date, default: Date.now }
});

export default mongoose.model('ActivityLog', schema);