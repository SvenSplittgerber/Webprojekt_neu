var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geolocationCountriesSchema = new Schema({
    category: String,
    visitors: Number,
    percentage: String,
    country: String
});

var geolocationCountries = mongoose.model('geolocationCountries', geolocationCountriesSchema);

module.exports = geolocationCountries;
