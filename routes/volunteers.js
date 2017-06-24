var api = require(__dirname + "/../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../helpers/parser.js");
var apihelper = require(__dirname + "/../helpers/apihelper.js");
var path = require('path');

router.get("/volunteers", function(req, res){
  var user = parser.getUser(req);
  api.getAllTasks(
    function(error, response, body)
    {
      var result = [];
      var tasks = parser.parseAllTasks(JSON.parse(body));
      var actualTasks = [];
      for (i = 0; i < tasks.length; i++)
      {
        if (!tasks[i].is_template)
        {
          actualTasks.push(tasks[i]);
        }
      }

      var volunteersToGet = 0;
      for (i = 0; i < actualTasks.length; i++)
      {

        api.getTaskVolunteers(actualTasks[i].id, 
          function(error, response, body)
          {
            if (error)
            {
              console.log(error);
              res.status(404).send("Not Found.");
            }


            var volunteers = [];
            var volunteerResult = JSON.parse(body);
            var vols = volunteerResult[0];
            var volHours = volunteerResult[1];

            for (j = 0; j < vols.length; j++)
            {
              volunteers.push({
                vol_name: vols[j].name, 
                vol_email: vols[j].email, 
                vol_hours: volHours[j].hours
              });
            }

            result.push({
              task_id: actualTasks[volunteersToGet].id, 
              task_name: actualTasks[volunteersToGet].title,
              task_description: actualTasks[volunteersToGet].description,
              volunteers: volunteers
            });

            volunteersToGet++;

            if (volunteersToGet == actualTasks.length)
            {
              var toSend =
              {
                pageTitle: 'Haven - View Volunteers', 
                taskList: result
              }
              res.render('volunteers', toSend);
            }
          }
          );
      }
    }
    );  
});

module.exports = router;