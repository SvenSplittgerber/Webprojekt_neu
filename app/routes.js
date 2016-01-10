var General = require('./models/General');
var Visitors = require('./models/Visitors');
var RequestedFiles = require('./models/RequestedFiles');
var RequestedStaticFiles = require('./models/RequestedStaticFiles');
var GeolocationContinents = require('./models/GeolocationContinents');
var GeolocationCountries = require('./models/GeolocationCountries');

// BAUSTELLE

module.exports = function(app) {
 app.get('/api/data', function(req, res) {

  General.find({}, {'_id': 0, 'category': 1, 'name': 1, 'value': 1}, function(err, GeneralData) {

   if (err)
   res.send(err);
    res.json(GeneralData); // return all nerds in JSON format
  });
 });

 // frontend routes =========================================================
 //app.get('*', function(req, res) {
  //res.sendfile('./public/login.html');
 //});
}