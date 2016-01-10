var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var visitorsSchema = new Schema({
    category: String,
    hits: Number,
    percentage: String,
    date: String,
    bandwidth: Number
});

var visitors = mongoose.model('visitors', visitorsSchema);

module.exports = visitors;
