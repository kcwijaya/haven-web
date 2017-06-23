var api = require(__dirname + "/../../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../../helpers/parser.js");
var apihelper = require(__dirname + "/../../helpers/apihelper.js");

router.get('/skillCategories', function(req, res){
  api.getSkills(
    function(error, response, body){
      var skills = JSON.parse(body);
      var categories = [];
      for (i = 0; i < skills.length; i++)
      {
        if (categories.indexOf(skills[i].category) == -1)
        {
          categories.push(skills[i].category);
        }
      }

      res.json(categories);
    }
  );
});

router.post('/createSkill', function(req, res){
  api.addSkill(req.body, 
    function(error, response, body)
    {
      res.json(body);
    });
});

module.exports = router;