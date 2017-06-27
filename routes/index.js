var express = require('express');
var path = process.cwd();
//var peepdb = require('../model/peepBlog.js');
//const mongoose = require('mongoose');
var tiles = require('../serverSideJs/slidingServer');
var media = require('../serverSideJs/media');
module.exports = function(app,passport){

/*get the home page */
app.route('/').get(function(req,res){
  res.sendFile(path + "/public/views/index.html");
});

app.route('/tempindex').get(function(req,res){
  console.log("we made it to tempindex");
  console.log("path is ",path+'/public/views/tempindex.ejs');
  res.render(path + '/public/views/tempindex.ejs');
});

//log-in
app.get('/login',function(req,res){
//passposrt will return 401 and return immediate
  console.log("we made it to the login");
  res.render(path + '/public/views/login.ejs',{message:req.flash('loginMessage')});
});

app.post('/login',passport.authenticate('local-login',{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash : true
}));

//sign-up
app.get('/signup',function(req,res){
  console.log("we made it to the signup");
  res.render(path + '/public/views/signup.ejs',{message:req.flash('signupMessage')});
});

//process signup form
app.post('/signup',passport.authenticate('local-signup',{
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

//this will change
app.get('/profile',isLoggedIn,function(req,res){
  console.log("we made it to the profile");
    res.sendFile(path + "/public/views/index.html");
  //res.render(path + '/public/views/profile.ejs',{
  //  user:req.user //get the user info
});

//log the user out
app.get('/logout',function(req,res){
  console.log("we are in logout");
  req.logout();
  res.redirect('/');
});

//facebook routes
app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));

app.get('/auth/facebook/callback',passport.authenticate('facebook',{
  successRedirect: '/profile',
  failureRedirect:'/',
}));

//twitter routes
app.get('/auth/twitter',passport.authenticate('twitter'));

app.get('/auth/twitter/callback',passport.authenticate('twitter',{
  successRedirect: '/profile',
  failureRedirect: '/',
}));

//google routes
app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
//https://cloud.google.com/nodejs/getting-started/authenticate-users
//save the url of the users's current page so the app can redirect back to it
//(req,res,next) => {
//if(req.query.return){
//req.session.oath2return = req.query.return;
//}
//next();
//}

app.get('/auth/google/callback',passport.authenticate('google',{
  successRedirect:'/profile',
  failureRedirect:'/',
}));

app.route('/shiplogs').get(function(req,res){
  console.log("we are in /shiplogs");
  media.displayLog(function(err,docs){
    res.send(docs);
  });
});

app.route('/popposts').get(function(req,res){
  console.log("we are in the popposts");
  media.dispPopPost(function(err,docs){
    res.send(docs);
  });
});

//update popular posts likes or comments
app.route('/popposts/').post(function(req,res){
  console.log("in adding likes");
  media.addLikes(req,function(err,docs){
    res.send(docs);
  });
});

//app.route('/popposts/comment').post(function(req,res){
app.post('/popposts/comment',isLoggedIn,function(req, res, next) {
  console.log("****in adding comments");
  media.addComments(req,function(err,docs){
    res.send(docs);
  });
});

app.route('/newdata').get(function(req,res){
  var newBlog = peepBlog({
    title: "entered from program",
    by:"Buffy",
    entry:"buffy entry",
    likes: 2
  });
  newBlog.save(function(err) {
    if (err) throw err;

    console.log("Blog created");
  });
});

app.route('/sliding/').get(function(req,res){
  console.log("we made the request",req.query.board);
  var outstr = tiles.peep_play(req.query.board);
  console.log("we are back",outstr);
  res.send(outstr);
});



//make sure the user is logged in only using for comments so far
function isLoggedIn(req,res,next){
  console.log("in isLoggedIn");
  if (req.isAuthenticated())
    { console.log("we are logged in");
    return next();
  }
  // not logged in
  console.log("we are not logged in doing the redirect");
  //res.redirect(307,'/tempindex');
  //res.redirect('/tempindex');
  //res.send({redirect:'307/tempindex'});
  //res.status(500).send("the user isn't logged in");
  author = "login";
  comment ="";
  var docs = JSON.stringify({loggedin:"false"});
  res.send(docs);
}
}
