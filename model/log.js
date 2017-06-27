var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//schema for tigger's log
var shipLogSchema = new Schema({
  title: String,
  date : String,
  entry : String
});

module.exports = mongoose.model('Log',shipLogSchema);
