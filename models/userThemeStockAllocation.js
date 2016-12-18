var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    stockAllocation: [{
        stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
        exposure: { type: Number }
    }]
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('UserThemeStockAllocation', schema);