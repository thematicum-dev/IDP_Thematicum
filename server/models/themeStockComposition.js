/*
Adds a stock to a theme. 
The votes for the stocks are stored in userThemeStockAllocation
*/
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const schema = new Schema({
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isValidated: { type: Boolean, default: false },
    validatedAt: { type: Date }
}, {
    timestamps: { createdAt: 'addedAt'}
});

export default mongoose.model('ThemeStockComposition', schema);