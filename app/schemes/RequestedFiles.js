/* Schema definition for the requested files data. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var RequestedFilesSchema = new mongoose.Schema({
        _id: Schema.Types.ObjectId,
        category: String,
        hits: Number,
        percentage: String,
        url: String,
        bandwidth: Number,
        protocol: String,
        method: String
    });

    mongoose.model('requestedFiles', RequestedFilesSchema, 'requestedFiles');
};


