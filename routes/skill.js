var api = require(__dirname + "/../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../helpers/parser.js");
var apihelper = require(__dirname + "/../helpers/apihelper.js");
var path = require('path');

router.get('/properties', function(req, res){
  var result = { pageTitle: 'Haven - Create Skills and Disclaimers'};
  api.getSkills(
  function(error, response, body)
  {
    var skills = JSON.parse(body);
    api.getDisclaimers(
      function(error, response, body){
        var disclaimers = JSON.parse(body);

        result.skills = skills;
        result.disclaimers = disclaimers;
        res.render('createskills', result);

    });
  }
  );
});

module.exports = router;