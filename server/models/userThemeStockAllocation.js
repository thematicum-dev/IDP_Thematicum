var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    themeStockComposition: { type: Schema.Types.ObjectId, ref: 'ThemeStockComposition' },
    exposure: { type: Number }
});

module.exports = mongoose.model('UserThemeStockAllocation', schema);