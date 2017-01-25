var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    themeProperties: {
        timeHorizon: { type: Number },
        maturity: { type: Number },
        categories: [{ type: Number }]
        }
});

module.exports = mongoose.model('UserThemeInput', schema);