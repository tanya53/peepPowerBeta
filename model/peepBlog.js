//need to pull the user into its own database, use two mongoose databases
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

//schema for user for authentication
var userSchema = new Schema({
  local :{
    email : String,
    password : String,
  },
  facebook : {
    id : String,
    token : String,
    email : String,
    name : String,
    username: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username : String,
  },
  google : {
    id : String,
    token : String,
    email : String,
    name : String
  },
});

//generate the hash of the password, encrypt in database for local user
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

//check if the password is valid or Not for local user
userSchema.methods.validPassword = function(password,pass2){
  return bcrypt.compareSync(password,pass2);

};

module.exports = mongoose.model('User',userSchema);
//var user = mongoose.model('user',userSchema,'users');
//module.exports = {user:user};
