var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var RequestedStaticFilesSchema = new mongoose.Schema({
        _id: Schema.Types.ObjectId,
        category: String,
        hits: Number,
        percentage: String,
        url: String,
        bandwidth: Number,
        protocol: String,
        method: String
    });

    mongoose.model('requestedStaticFiles', RequestedStaticFilesSchema, 'requestedStaticFiles');
};;
