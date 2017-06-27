var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//schema for popular post
// create a Schema for popular post articles and the comments
var popularPostSchema = new Schema({
  title: String,
  by : String,
  entry: String,
  likes : Number,
  date : String,
  comments : [{commentdate : String,comment:String,author:String,commentlikes:Number}]
});

module.exports = mongoose.model('Post',popularPostSchema);
