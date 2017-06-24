var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var api = require(__dirname + "/helpers/oracle-api.js");
var apihelper = require(__dirname + "/helpers/apihelper.js");
var parser = require(__dirname + "/helpers/parser.js");
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var passport = require(__dirname + "/helpers/auth.js");

app.use(cookieSession({
  name: 'session',
  keys: ['1', '2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_birthday']}));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
    failureRedirect: '/' }));

app.engine('html', require(__dirname + "/helpers/hbs.js").engine);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(require(__dirname + "/routes/home.js"));
app.use(require(__dirname + "/routes/files.js"));
app.use(require(__dirname + "/routes/skill.js"));
app.use(require(__dirname + "/routes/task.js"));
app.use(require(__dirname + "/routes/template.js"));
app.use(require(__dirname + "/routes/volunteers.js"));
app.use(require(__dirname + "/routes/api/disclaimer.js"));
app.use(require(__dirname + "/routes/api/org.js"));
app.use(require(__dirname + "/routes/api/skills.js"));
app.use(require(__dirname + "/routes/api/task.js"));
app.use(require(__dirname + "/routes/api/template.js"));
app.use(require(__dirname + "/routes/api/user.js"));


http.listen(process.env.PORT || 5000, function() {
  console.log('listening on ' + process.env.PORT || 5000);
});


