var api = require(__dirname + "/../../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../../helpers/parser.js");
var apihelper = require(__dirname + "/../../helpers/apihelper.js");

router.post('/createDisclaimer', function(req, res){
  api.addDisclaimer(req.body, 
    function(error, response, body)
    {
      res.json(body);
    });
});

module.exports = router;