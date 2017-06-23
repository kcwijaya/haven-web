var api = require(__dirname + "/../../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../../helpers/parser.js");
var apihelper = require(__dirname + "/../../helpers/apihelper.js");

router.get('/users/all', function(req, res){
  api.parser.getUsers( 
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }
      body = JSON.parse(body);
      res.json(body);
    }
    );
});


module.exports = router;