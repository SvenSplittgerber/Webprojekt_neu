// Modules
var express        = require('express');
var app            = express();
//var bodyParser     = require('body-parser');
//var methodOverride = require('method-override');

// Configuration
var port = process.env.PORT || 8080; // set our port

// Not needed anymore?
//app.use(bodyParser.json()); // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
//app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// Setting the static files location
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// Passing the application into routes
require('./app/routes')(app);

// Starting the app
app.listen(port);	
console.log('Server läuft auf Port ' + port);
exports = module.exports = app;