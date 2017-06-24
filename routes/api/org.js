var api = require(__dirname + "/../../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../../helpers/parser.js");
var apihelper = require(__dirname + "/../../helpers/apihelper.js");

router.post('/orgs', function(req, res){
  api.addOrganization(req.body, 
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found.");
      }
      res.json(body);
    }
    );
});

router.get('/orgs', function(req, res){
  api.getOrganizations(
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");
      }

      body = JSON.parse(body);
      res.json(body);
    });
});

router.get('/org', function(req, res){
  var id = req.query.id;
  api.getOrganizationByID( id,
    function(error,response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");
      }
      body = JSON.parse(body);
      res.json(body);
    })
});

module.exports = router;