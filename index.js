var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    app = express(),
    path = process.cwd(),
    db = require('./model/db');
//added for passport
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var morgan = require('morgan');
var session = require('express-session');
var routes = require('./routes/index.js');

require('./serverSidejs/passport.js')(passport);
app.use(favicon(path+"/public/images/favicon.ico"));
app.use(morgan('dev'));//log every request to the console
app.use(cookieParser());//read cookies needed for auth
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set('port',(process.env.PORT||5000));

app.set('view engine','ejs');// use ejs for templating

//required for passport
app.use(session({secret:'tiggeristhebest',
                 resave : true,
                 saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());//persistant login sessions
app.use(flash()); //for flash messages in session - error for login

app.use('/',express.static(__dirname+'/public'));
app.use('/css',express.static(__dirname+'/public/css'));
app.use('/images',express.static(__dirname+'/public/images'));
//app.use('/',routes);
//catch 404 and forwarding to error handler
routes(app,passport);
app.use(function(req,res,next){
  var err =  new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handlers
//dev error handler with stacktrace
if (app.get('env')==='development'){
  app.use(function(err,req,res,next){
    re.status(err.status || 500);
    res.send(err.message + " " + err.status+" " +err);
  });
}

//production err without stacktrace
app.use(function(err,req,res,next){
  console.log("we are in the error w/o stack");
  res.status(err.status || 500);
  res.send(err.message + " " + err);
});
module.exports = app; //export for use by other programs
app.listen(app.get('port'),function(){
console.log("Node app is running on port",app.get('port'));
})
