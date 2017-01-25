var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constants = require('../utilities/constants');

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    themeStockComposition: { type: Schema.Types.ObjectId, ref: 'ThemeStockComposition' },
    exposure: {
        type: Number,
        required: true,
        minlength: constants.MIN_EXPOSURE,
        maxlength: constants.MAX_EXPOSURE
    }
});

module.exports = mongoose.model('UserThemeStockAllocation', schema);