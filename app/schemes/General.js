/* Schema definition for the general data. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var generalSchema = new mongoose.Schema({
        _id: Schema.Types.ObjectId,
        category: String,
        name: String,
        value: String
    });

    mongoose.model("general", generalSchema, "general");
};
