/* Author: Johannes Rehm */
/* Server.js which is used for configuration and starting of the application. */

// Modules
var express        = require('express');
var app            = express();

// Configuration
var port = process.env.PORT || 8080; // set our port

// Setting the static files location
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// Passing the application into routes
require('./app/routes')(app);

// Starting the app
app.listen(port);	
console.log('Server läuft auf Port ' + port);

exports = module.exports = app;