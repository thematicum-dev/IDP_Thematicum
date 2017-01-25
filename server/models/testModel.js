var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: { type: String, minlength: 5, maxlength: 6 }
});

module.exports = mongoose.model('Test', schema);