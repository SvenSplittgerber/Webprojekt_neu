/* Schema definition for the geolocation (countries) data. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var GeolocationCountriesSchema = new mongoose.Schema({
        _id: Schema.Types.ObjectId,
        category: String,
        visitors: Number,
        percentage: String,
        country: String
    });

    mongoose.model('geolocationCountries', GeolocationCountriesSchema, 'geolocationCountries');
};
