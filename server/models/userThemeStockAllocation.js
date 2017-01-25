var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constants = require('../utilities/constants');

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    themeStockComposition: { type: Schema.Types.ObjectId, ref: 'ThemeStockComposition' },
    exposure: {
        type: Number,
        required: true,
        min: constants.MIN_EXPOSURE,
        max: constants.MAX_EXPOSURE
    }
});

module.exports = mongoose.model('UserThemeStockAllocation', schema);