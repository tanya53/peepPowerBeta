var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


    //schema for polls
    var pollSchema = new Schema({
      creator : String,
      title: String,
      items:[{itemnbr: Number, item:String,votes:String}]
    });

module.exports = mongoose.model('Poll',pollSchema);
