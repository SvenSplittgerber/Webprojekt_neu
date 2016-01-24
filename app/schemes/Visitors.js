/* Author: Johannes Rehm */
/* Schema definition for the visitors data. */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var VisitorsSchema = new mongoose.Schema({
        _id: Schema.Types.ObjectId,
        category: String,
        hits: Number,
        percentage: String,
        date: String,
        bandwidth: Number
    });

    mongoose.model('visitors', VisitorsSchema, 'visitors');
};
