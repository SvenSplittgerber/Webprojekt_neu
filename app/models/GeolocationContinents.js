var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var GeolocationContinentsSchema = new mongoose.Schema({
        _id: Schema.Types.ObjectId,
        category: String,
        visitors: Number,
        percentage: String,
        continent: String
    });

    mongoose.model('geolocationContinents', GeolocationContinentsSchema, 'geolocationContinents');

};