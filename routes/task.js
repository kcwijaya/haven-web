var api = require(__dirname + "/../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../helpers/parser.js");
var apihelper = require(__dirname + "/../helpers/apihelper.js");
var path = require('path');


router.get('/tasks', function(req, res){
  res.sendFile(path.join(__dirname, '../views/BrowseTasks.html'));
});


router.get('/create', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/TaskCreationHome.html'));
});

router.post('/post-task', function(req, res){
  var taskToAdd =  parser.populateTask(req.body);
  taskToAdd.id = undefined;
  var task = req.body;
  var user = parser.getUser(req);

  if (typeof user == 'string')
  {
    user = JSON.parse(req.session.passport.user);
  }

  task.admin_id = parseInt(user.id);
  taskToAdd.admin_id = parseInt(user.id);

  api.getSeverities(
    function(error, response, body){
      var sevs = JSON.parse(body);
      var dict = {};
      for (i = 0; i < sevs.length; i++)
      {
        dict[sevs[i].severity_level] = sevs[i].id;
      }

      task.severity_id = dict[task.severity_id];
      taskToAdd.severity_id = task.severity_id;
      task.status = 'scheduled';

      if (typeof task.num_volunteers != 'undefined')
      {
        taskToAdd.num_volunteers = parseInt(task.num_volunteers);
      }
      if (typeof task.latitude != 'undefined')
      {
        taskToAdd.latitude = parseFloat(task.latitude);
      }
      if (typeof task.longitude != 'undefined')
      {
        taskToAdd.longitude = parseFloat(task.longitude);
      }

      taskToAdd.organization_id = user.organization_id;
      api.addNewTask(taskToAdd, 
        function(error, response, body){
          if (error)
          {
            console.log(error);
            res.status(404).send("Not Found");
          }
          var id = body.id;
          task.id = id;

          if (typeof task.skills != 'undefined' && task.skills.length >0)
          {
            apihelper.startWithAddingSkillsTask(task, res);
          }
          else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
          {
            apihelper.startWithAddingDisclaimersTask(task, res);
          }
          else
          {
            res.status(200).json(taskToAdd);
          }
        }
        );
    });
});

router.get('/tasks/view', function(req, res){
  api.getTaskByID( req.query.id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send('Not found');
      }

      var task = parser.parseOneTask(body);

      api.getSeverities(
        function(error, response, body){
          var sevs = JSON.parse(body);
          var dict = {};
          for (i = 0; i < sevs.length; i++)
          {
            dict[sevs[i].id] = sevs[i].severity_level;
          }
          task.severity_id = dict[task.severity_id];

          api.getOrganizationByID(task.organization_id, 
            function(error, response, body)
            {
              body = JSON.parse(body);
              task.organization = body.name;
              api.getTaskVolunteers(req.query.id, 
                function(error, response, body)
                {
                  if (error)
                  {
                    console.log(error);
                    res.status(404).send('Not Found');
                  }

                  body = JSON.parse(body);
                  task.volunteers = body[0];
                  if (typeof task.volunteers != 'undefined')
                  {
                    for (i = 0; i < task.volunteers.length; i++)
                    {
                      task.volunteers[i].hours = body[1][i].hours;
                      if (task.volunteers[i].hours == null)
                      {
                        task.volunteers[i].hours = 0;
                      }
                    }
                  }
                  res.render('task-details', task);
                }
                )
            }

            )
        }
        );
    }
    );
});



router.post('/review-new', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  return res.render('review', req.body);
});

router.post('/review-task', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  return res.render('task-review', req.body);
});

router.post('/review-template', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  return res.render('template-review', req.body);
});

router.post('/save-task', function(req, res){
  var task = parser.populateTask(req.body);

  var user = parser.getUser(req);
  api.getSeverities(
    function(error, response, body){
      var sevs = JSON.parse(body);
      var dict = {};
      for (i = 0; i < sevs.length; i++)
      {
        dict[sevs[i].severity_level] = sevs[i].id;
      }

      task.severity_id = dict[task.severity_id];

      task.organization_id = parseInt(user.organization_id);
      if (typeof task.num_volunteers != 'undefined')
      {
        task.num_volunteers = parseInt(task.num_volunteers);
      }
      if (typeof task.latitude != 'undefined')
      {
        task.latitude = parseFloat(task.latitude);
      }
      if (typeof task.longitude != 'undefined')
      {
        task.longitude = parseFloat(task.longitude);
      }

      api.editTask(task, 
        function(error, response, body)
        {
          if (error)
          {
            console.log(error);
            res.status(404).send("Not Found");
          }

          apihelper.startWithGettingVolunteersTask(req.body, res);

        }
        );
    }
    );
});

router.get('/create/new', function(req, res) {
  if (typeof req.query.id == 'undefined')
  {
    parser.getFields(req.query, function(result){
      result.pageTitle = "Haven - Create";
      result.newBtn = true;
      var user = parser.getUser(req);
      result.username = user.name;
      res.render('task-create', result);
    });
  }
  else if (req.query.type == 'task')
  {
   api.getTaskByID( req.query.id,
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");
      }

      body = parser.parseOneTask(body);

      parser.getFields(body, function(result){
        result.pageTitle = "Haven - Create";
        result.newBtn = true;
        result.oldTask = true;

        res.render('task-create', result);
      });
    });
 }
 else
 {
  api.getTemplateByID( req.query.id,
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");
      }


      body = parser.parseOneTemplate(body);

      parser.getFields(body, function(result){
        result.pageTitle = "Haven - Create";
        result.newBtn = true;
        result.templateBtn = true;
        res.render('task-create', result);
      });
    });
}
});

router.get('/tasks/hours', function(req, res){
  var taskID = req.query.id;
  var title = req.query.title;

  task = {};
  task.id = taskID;
  task.title = title;
  api.getTaskVolunteers( taskID, 
    function(error, response, body)
    {
      body = JSON.parse(body);
      task.volunteers = body[0];
      if (typeof task.volunteers != 'undefined')
      {
        for (i = 0; i < task.volunteers.length; i++)
        {
          task.volunteers[i].hours = body[1][i].hours;
          if (task.volunteers[i].hours == null)
          {
            task.volunteers[i].hours = 0;
          }
        }
      }
      task.pageTitle = "Haven - Log Hours";
      res.render('log-hours', task);
    }
    );
});

router.post('/tasks/hours', function(req, res){
  var volunteerID = req.query.volID;
  var hours = req.query.hours;
  var taskID = req.query.taskID;


  api.logVolunteerHours(volunteerID, taskID, hours, 
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).render('error', {error: error});
      }
      res.json(body);
    });
  
});

router.get('/tasks/edit', function(req, res) {
  var taskID = req.query.id;
  api.getTaskByID( taskID, 
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send('Not Found');
      }

      var task = parser.parseOneTask(body);

      api.getTaskVolunteers( taskID, 
        function(error, response, body)
        {
          body = JSON.parse(body);
          task.volunteers = body[0];
          for (i = 0; i < task.volunteers.length; i++)
          {
            var hours = body[1][i].hours;
            if (hours == null)
            {
              hours = 0;
            }

            task.volunteers[i].hours = hours;
          }
          parser.getFields(task, function(result){
            result.taskBtn = true;
            result.oldTask = true;
            result.pageTitle = "Haven - Edit Task";
            res.render('task-create', result);
          });
        }
        );


    }
    );
});

module.exports = router;
