//config/auth.js

module.exports = {
  facebookAuth: {
  clientID : '808624309287467',
  clientSecret : 'b872aea55d60ed954d696fbb747a5709',
  callbackURL : 'http://localhost:5000/auth/facebook/callback',
},
twitterAuth: {
  consumerKey : "0whgK1GqgEaeNYSi7z6abbCYB",
  consumerSecret: "W1xykZ6DAmzYIAShT14eqZlDikCneSiDTiwV9BhLhyA8HmPa4q",
  callbackURL: 'http://localhost:5000/auth/twitter/callback',
},
googleAuth: {
  clientID : "98227431883-2nccjqnstnsp7sc6pleidrcettil8oop.apps.googleusercontent.com",
  clientSecret: "pADdq0uOwQ-BcLfOU2BKdG-2",
  callbackURL : 'http://localhost:5000/auth/google/callback',
},
};
