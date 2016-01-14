exports.initialize = function(){
    require("fs").readdirSync(__dirname + "/models").forEach(function(file){
        require('./models/' + file)();
    });
};