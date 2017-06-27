var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../model/peepBlog.js');
var configAuth = require('../config/auth.js');
var mongoose = require('mongoose');

module.exports = function(passport){
  //session setup
  passport.serializeUser(function(user,done){
    done(null,user.id);
  });

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
    //db.user.findById(id,function(err,user){
      if(!err) done(null,user);
      else {
        console.lod("error in deserializeuser ");
        done (err,null);
      }
    });
  });

  //local login
  passport.use('local-login',new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // passentire request
  },
  function(req,email,password,done){// email and password from form }
    User.findOne({'local.email':email},function(err,user){
    //db.user.findOne({'local.email':email},function(err,user){
    if (err)
      return done(err);
    if (!user)
      return done(null,false,req.flash('loginMessage','No user found.'));
    if (!user.validPassword(password,user.local.password)){
      return done(null,false,req.flash('loginMessage','Incorrect password'))};
    return done(null,user);
  });
}));

  //local singup
passport.use('local-signup',new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true,//pass back entire request
  },
  function(req,email,password,done){
    //asynchronous
    process.nextTick(function(){
      console.log("point 1");
      User.findOne({'local.email':email},function(err,user){
      //db.user.findOne({'local.email':email},function(err,user){
      if (err){
        console.log("point 2");
        return done(err)
      }
      if (user) {
        console.log("point 3");
        return done(null,false,req.flash('signupMessage','This email is already has user'))
      } else {
        console.log("point 4");
        var newUser = new db.user();
        newUser.password = password;
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function(err){ //added the user to the database
          if (err){
            throw err;
          }
          return done(null,newUser);

        });//save
      }//else
    });//findOne
  });//nextick
  }
));

//facebook signin
passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL : configAuth.facebookAuth.callbackURL,
  profileFields: ['id','email','first_name','last_name'],
  },
  function(token,refreshToken,profile,done){
    process.nextTick(function(){
    User.findOne({'facebook.id':profile.id},function(err,user){
    //db.user.findOne({'facebook.id':profile.id},function(err,user){
      if (err)
        return done(err);
      if (user) {
        user.id = user._id;
        return done(null,user);
      } else {
        var newUser = new db.user();
        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.name = profile.name.givenName + " "+profile.name.familyName;
        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

        newUser.save(function(err){
          if (err)
            throw err;
          console.log("newuser._id",newUser._id);
          return done(null,newUser);
        });
      }
    });
    });
  }));

  //twitter signin
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL : configAuth.twitterAuth.callbackURL,
    },
    function(token,refreshToken,profile,done){
      process.nextTick(function(){
        User.findOne({'twitter.id':profile.id},function(err,user){
        //db.user.findOne({'twitter.id':profile.id},function(err,user){
          if (err)
            return done(err);
          if (user) {
            user.id = user._id;
            return done(null,user);
          } else {
            var newUser = new db.user();
            newUser.twitter.id = profile.id;
            newUser.twitter.token = token;
            newUser.twitter.username = profile.username;
            newUser.twitter.displayName = profile.displayName;

            newUser.save(function(err){
              if (err)
                throw err;
              return done(null,newUser);
            });
          }
        });
      });
    }));

//google signin
function extractProfile (profile) {
  return {id : profile.id,
          displayName: profile.displayName,
        };
}
passport.use(new GoogleStrategy({
  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL : configAuth.googleAuth.callbackURL,
  },
  function(token,refreshToken,profile,done){
    process.nextTick(function(){
      User.findOne({'google.id':profile.id},function(err,user){
      //db.user.findOne({'google.id':profile.id},function(err,user){
        if (err)
          return done(err);
        if (user) {
          user.id = user._id;
          return done(null,user);
        } else {
          var newUser = new db.user();
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;

          newUser.save(function(err){
            if (err)
              throw err;
            return done(null,newUser);
          });
        }
      });
    });
  }));
}
