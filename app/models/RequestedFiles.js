var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestedFilesSchema = new Schema({
    category: String,
    hits: Number,
    percentage: String,
    url: String,
    bandwidth: Number,
    protocol: String,
    method: String
});

var requestedFiles = mongoose.model('requestedFiles', requestedFilesSchema);

module.exports = requestedFiles;
