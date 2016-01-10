var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestedStaticFilesSchema = new Schema({
    category: String,
    hits: Number,
    percentage: String,
    url: String,
    bandwidth: Number,
    protocol: String,
    method: String
});

var requestedStaticFiles = mongoose.model('requestedStaticFiles', requestedStaticFilesSchema);

module.exports = requestedStaticFiles;
