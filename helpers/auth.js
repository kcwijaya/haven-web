var passport = require('passport');
var api = require(__dirname + "/oracle-api.js");
var FacebookStrategy = require('passport-facebook').Strategy;
var express = require('express');
var router = express.Router();

passport.use(new FacebookStrategy({
  clientID: '1013143872154300',
  clientSecret: 'bab2aee47233642619500e81e7b203ef',
   callbackURL: "http://havenweb.herokuapp.com/auth/facebook/callback",
  profileFields: ['id', 'birthday', 'email', 'first_name', 'last_name', 'gender']
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  api.getAdminByID(profile.id,
    function(error, response, body)
    {
      if (response.statusCode == 404)
      {
        api.getOrganizations(
          function(error, response, body){
            body = JSON.parse(body);
            var org = body[0].id;
            console.log('USER NOT FOUND!!!\n');
            var user = {
              id: profile.id, 
              first_name: profile._json.first_name,
              last_name: profile._json.last_name, 
              email: profile._json.email,
              organization_id: org
            }
            api.addAdmin(user,
              function(error, response, body){
                if (error)
                {
                  done(error, user);
                }
                done(null, user);
              }
              );
          });       
      }
      else
      {
        done(null, body);
      }
    }
    );
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
