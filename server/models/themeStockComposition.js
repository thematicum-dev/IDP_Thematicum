var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isValidated: { type: Boolean, default: false },
    validatedAt: { type: Date }
}, {
    timestamps: { createdAt: 'addedAt'}
});

module.exports = mongoose.model('ThemeStockComposition', schema);