
const mongoose = require('mongoose');
var sanitizer = require('sanitizer'); //remove html from the user input
var Log = require('../model/log.js');
var Post = require('../model/post.js');
  //yet to fix:
  // - error  handling
  // - get next block of entries
  //return the log posts to the client
  exports.displayLog = function (cb){
      Log.find({},function(err,docs){
        cb(err,docs);
      });
  };

  exports.dispPopPost = function (cb){
    console.log("in displayposts");
    Post.find({},function(err,docs){
      console.log("docs ",docs);
        cb(err,docs);
    });
  };

  exports.addLikes = function(req,cb){

    var query;
    var ObjectId = require('mongoose').Types.ObjectId;
    var query = {_id:new ObjectId(req.body.id.toString())};
    const collec="posts";
    var likes = parseInt(req.body.likes);
    if (likes == -1) {//updating like article
      query = {_id:new ObjectId(req.body.id.toString())};
      console.log("in increment");
      inc = {$inc:{likes:1}};
    } else {
      console.log("likes ",likes+1);
      likes +=1;
      query = {_id:new ObjectId(req.body.id.toString()),'comments.nbr':likes};
      inc = {$inc:{'comments.$.like':1}};
    }
    Post.update(query,inc,function(err,docs){
      if (err) {console.log("there was an error",err)}
      else{
        cb(err,docs);
      }
    });
};

exports.addComments = function(req,cb){
  //need to sanitize the comment before storing, then don't check when take out
  var ObjectId = require('mongoose').Types.ObjectId;
  const collec="posts";
  var author = sanitizer.sanitize(req.body.author);
  var comment = sanitizer.sanitize(req.body.comment);
  var nbr = parseInt(req.body.nbr);
  console.log("nbr ",nbr);
  query = {_id:new ObjectId(req.body.id.toString())};
  var push = {'$push':{'comments':{'date':'today','nbr':nbr,'comment':comment,'author':author,'commentlikes':0}}};
  Post.update(query,push,function(err,docs){
    if (err) {
      console.log("there was as error",err);
      outstr = "";
    }
    else {
      //make the author and comment json and send back
      var outstr = JSON.stringify({loggedin : "true",author:author,comment:comment});
    }
    cb(err,outstr);
  });
};
