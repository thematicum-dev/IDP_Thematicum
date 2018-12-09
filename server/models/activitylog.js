import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;
const UserThemeInputSchema = mongoose.model('UserThemeInput').schema;
const UserThemeStockAllocation = mongoose.model('UserThemeStockAllocation').schema;
const UserThemeFundAllocation = mongoose.model('UserThemeFundAllocation').schema;
const Stock = mongoose.model('Stock').schema;
const Fund = mongoose.model('Fund').schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: {type: String, default: null},
    theme: { type: Schema.Types.ObjectId, ref: 'Theme', index: true },
    themeName: { type: String, default: null},
    userThemeInput: { type: UserThemeInputSchema, default: null },
    userThemeStockAllocation: { type: UserThemeStockAllocation, default: null },
    userThemeFundAllocation: { type: UserThemeFundAllocation, default: null },
    stock: {type: String, default: null},
    fund: {type: String, default: null},
    createdAt : { type : Date, default: Date.now },
    visible: {type: Boolean, default: true}
});

export default mongoose.model('ActivityLog', schema);