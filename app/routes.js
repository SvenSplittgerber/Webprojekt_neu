/* Author: Johannes Rehm */
/* Defining the basic route for getting the data from MongoDB. */

var mongoose = require('mongoose');
var async = require('async');
var db = require('../config/db');

// Set up the Models using the schemes.js
require('./schemes.js').initialize();

// Connecting to MongoDB
mongoose.connect(db.dbUrl);

// Getting the defined models from Mongoose
var General = mongoose.model('general');
var Visitors = mongoose.model('visitors');
var RequestedFiles = mongoose.model('requestedFiles');
var RequestedStaticFiles = mongoose.model('requestedStaticFiles');
var GeolocationContinents = mongoose.model('geolocationContinents');
var GeolocationCountries = mongoose.model('geolocationCountries');

// Exporting the data using Async to avoid callback hell
module.exports = function (app) {

    app.get('/api/data', function (req, res) {
        async.parallel([

                // Read general data
                function (callback) {
                    var query = General.find();
                    query.exec(function (err, general) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, general);
                    });
                },

                // Read visitors data
                function (callback) {
                    var query = Visitors.find();

                    query.exec(function (err, visitors) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, visitors);
                    });
                },

                // Read requested files
                function (callback) {
                    // Getting descending sorted data (sadly does not work for the dates that easily...)
                    var query = RequestedFiles.find({}).sort({hits: -1});
                    query.exec(function (err, requestedFiles) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, requestedFiles);
                    });
                },

                // Read requested static files
                function (callback) {
                    var query = RequestedStaticFiles.find();
                    query.exec(function (err, requestedStaticFiles) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, requestedStaticFiles);
                    });
                },

                // Read geolocation continents
                function (callback) {
                    var query = GeolocationContinents.find();
                    query.exec(function (err, geolocationContinents) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, geolocationContinents);
                    });
                },

                // Read geolocation countries
                function (callback) {
                    var query = GeolocationCountries.find();
                    query.exec(function (err, geolocationCountries) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, geolocationCountries);
                    });
                }
            ],

            // Compute results
            function (err, results) {
                if (err) {
                    console.log(err);
                    return res.send(400);
                }

                if (results == null || results[0] == null) {
                    return res.send(400);
                }

                var logData = {};
                logData.general = results[0] || [];
                logData.visitors = results[1] || [];
                logData.requestedFiles = results[2] || [];
                logData.requestedStaticFiles = results[3] || [];
                logData.geolocationContinents = results[4] || [];
                logData.geolocationCountries = results[5] || [];

                res.type('json');
                return res.send(logData);
            });
    })
};

// Alternative way (callback hell)
/*app.get('/api/data', function (req, res) {

 General.find({}, {'_id': 1, 'category': 1, 'name': 1, 'value': 1}, function (err, GeneralData) {
 if (err) {
 res.send(err);
 }

 Visitors.find({}, {
 '_id': 1,
 'category': 1,
 'hits': 1,
 'percentage': 1,
 'date': 1,
 'bandwidth': 1
 }, function (err, VisitorsData) {
 if (err) {
 res.send(err);
 }

 RequestedFiles.find({}, {
 '_id': 1,
 'category': 1,
 'hits': 1,
 'percentage': 1,
 'url': 1,
 'bandwidth': 1,
 'protocol': 1,
 'method': 1
 }, function (err, RequestedFilesData) {
 if (err) {
 res.send(err);
 }

 RequestedStaticFiles.find({}, {
 '_id': 1,
 'category': 1,
 'hits': 1,
 'percentage': 1,
 'url': 1,
 'bandwidth': 1,
 'protocol': 1,
 'method': 1
 }, function (err, RequestedStaticFilesData) {
 if (err) {
 res.send(err);
 }

 GeolocationContinents.find({}, {
 '_id': 1,
 'category': 1,
 'visitors': 1,
 'percentage': 1,
 'country': 1
 }, function (err, GeolocationContinentsData) {
 if (err) {
 res.send(err);
 }

 GeolocationCountries.find({}, {
 '_id': 1,
 'category': 1,
 'visitors': 1,
 'percentage': 1,
 'country': 1
 }, function (err, GeolocationCountriesData) {
 if (err) {
 res.send(err);
 }

 console.log("Daten wurden erfolgreich aus der Datenbank extrahiert.");
 res.send({
 General: GeneralData,
 Visitors: VisitorsData,
 RequestedFiles: RequestedFilesData,
 RequestedStaticFiles: RequestedStaticFilesData,
 GeolocationContinents: GeolocationContinentsData,
 GeolocationCountries: GeolocationCountriesData
 });
 })
 })
 })
 })
 })
 })
 })*/
