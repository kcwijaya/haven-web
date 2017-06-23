var api = require(__dirname + "/../../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../../helpers/parser.js");
var apihelper = require(__dirname + "/../../helpers/apihelper.js");

router.get('/tasks/id', function(req, res) {
  var id = req.query.id;

  api.getTaskByID( id,
    function(error, response, body)
    {
      var task = parser.parseOneTask(body);
      res.json(task);
    }
    );
});

router.get('/tasks/all', function(req, res) {
  var user = parser.getUser(req);
  console.log("#########GETTING ALL TASKS FOR: " + user.organization_id);
  api.getAllTasks( 
    function(error, response, body)
    {
      var tasks = parser.parseAllTasks(JSON.parse(body));
      var ret = [];
      for (i = 0; i < tasks.length; i++)
      {
        if (!tasks[i].is_template)
        {
          ret.push(tasks[i]);
        }
      }
      res.json(ret);
    }
    );
});

router.get('/tasks/skills', function(req, res){
  var id = req.query.id;

  api.getTaskSkills( id,
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

router.get('/tasks/disclaimers', function(req, res){
  var id = req.query.id;

  api.getTaskDisclaimers( id,
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

router.get('/tasks/delete', function(req, res){
  var id = req.query.id;
  api.deleteTask(id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found.");
      }

      res.json(JSON.parse(body));
    }
  )
});

router.get('/tasks/volunteers', function(req, res){
 api.getTaskVolunteers( req.query.id, 
  function(error, response, body)
  {
    if (error)
    {
      console.log(error);
      res.status(404).send("Not Found.");
    }
    body = JSON.parse(body);
    res.json(body);
  }
  );
});

module.exports = router;
