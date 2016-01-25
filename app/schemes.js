/* Author: Johannes Rehm */
/* Function to initialize the Mongoose schemes in /schemes */
exports.initialize = function(){
    require("fs").readdirSync(__dirname + "/schemes").forEach(function(file){
        require('./schemes/' + file)();
    });
};