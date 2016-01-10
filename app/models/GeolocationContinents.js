var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeolocationContinentsSchema = new Schema({
    category: String,
    visitors: Number,
    percentage: String,
    continent: String
});

var geolocationContinents = mongoose.model('geolocationContinents', GeolocationContinentsSchema);

module.exports = geolocationContinents;
