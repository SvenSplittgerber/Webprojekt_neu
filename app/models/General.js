var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var generalSchema = new Schema({
    category: String,
    name: String,
    value: String
});

var general = mongoose.model('general', generalSchema);

module.exports = general;
