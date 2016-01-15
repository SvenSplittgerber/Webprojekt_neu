var mongoose = require('mongoose');
var db = require('../config/db');

// Einlesen der Schemata
require('./models.js').initialize();

// Verbindung mit MongoDB herstellen
mongoose.connect(db.dbUrl);

var General = mongoose.model('general');
var Visitors = mongoose.model('visitors');
var RequestedFiles = mongoose.model('requestedFiles');
var RequestedStaticFiles = mongoose.model('requestedStaticFiles');
var GeolocationContinents = mongoose.model('geolocationContinents');
var GeolocationCountries = mongoose.model('geolocationCountries');

module.exports = function (app) {
    app.get('/api/data', function (req, res) {

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
    })
}