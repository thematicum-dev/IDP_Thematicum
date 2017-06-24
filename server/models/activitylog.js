import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;
const UserThemeInputSchema = mongoose.model('UserThemeInput').schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme', index: true },
    userThemeInput: UserThemeInputSchema,
    createdAt : { type : Date, default: Date.now }
});

export default mongoose.model('ActivityLog', schema);