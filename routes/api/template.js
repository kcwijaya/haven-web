var api = require(__dirname + "/../../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../../helpers/parser.js");
var apihelper = require(__dirname + "/../../helpers/apihelper.js");

router.get('/templates/all', function(req, res){
  var user = parser.getUser(req);
  console.log("#########GETTING ALL TEMPLATES FOR: " + user.organization_id);

  api.getAllTemplates(
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");

      }
      body = JSON.parse(body);
      var templates = [];
      for (i = 0; i < body[0].length; i++)
      {
        if (body[0][i].is_template)
        {
          templates.push(body[0][i]);
        }
      }
      res.json(templates);
   }
   );
});

router.get('/templates/skills', function(req, res){
  var id = req.query.id;
  api.getTemplateSkills( id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");

      }

      body = JSON.parse(body);
      res.json(body);
    }
    );
});

router.get('/templates/disclaimers', function(req, res){
  var id = req.query.id;
  console.log('ID: ' + id);
  api.getTemplateDisclaimers( id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");  
      }
      body = JSON.parse(body);
      res.json(body);
    }
    );
});

module.exports = router;
