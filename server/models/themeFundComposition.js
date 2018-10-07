/*
Adds a fund to a theme.
The votes for the stocks are stored in userThemeFundAllocation
*/
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const schema = new Schema({
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    fund: { type: Schema.Types.ObjectId, ref: 'Fund' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isValidated: { type: Boolean, default: false },
    validatedAt: { type: Date }
}, {
    timestamps: { createdAt: 'addedAt'}
});

export default mongoose.model('ThemeFundComposition', schema);