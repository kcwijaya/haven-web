var api = require(__dirname + "/../helpers/oracle-api.js");
var express = require('express');
var parser = require(__dirname + "/../helpers/parser.js");
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.isAuthenticated())
  {
    if (typeof req.session.org != 'undefined')
    {
      var user = parser.getUser(req);
      req.session.passport.user.organization_id = req.session.org; 
      var edit = {
        organization_id: req.session.org,
        id: user.id
      }
      api.editAdmin(edit, 
        function(error, response, body){
          var user = parser.getUser(req);
          res.render('home-auth', {pageTitle: 'Haven - Home', name: user.first_name});
        }
        );
    }
    else
    {
     var user = parser.getUser(req);
     res.render('home-auth', {pageTitle: 'Haven - Home', name: user.first_name});
   }
 }
 else
 {
  res.sendFile(path.join(__dirname, '../views/Homepage.html'));
}
});

router.post('/signup', function(req, res){
  var user = 
  {
    first_name: req.body.firstName, 
    last_name: req.body.lastName, 
    email: req.body.email, 
    organization_id: req.body.organization
  }
  api.addAdmin(user,
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).render('error', {error: error});
      }
      res.redirect("/create");
    }
    );
});


router.get('/home', function(req, res) {
  if (req.isAuthenticated())
  {
   var user = parser.getUser(req);
   res.render('home-auth', {pageTitle: 'Haven - Home', name: user.first_name});
 }
 else
 {
  res.sendFile(path.join(__dirname, '../views/Homepage.html'));
}});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/signup', function(req, res){
  var org = req.query.org;
  req.session.org = org;

  res.redirect("/auth/facebook");
});

module.exports = router;
