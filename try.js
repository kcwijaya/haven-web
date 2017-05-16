var api = require(__dirname + "/oracle-api.js");

function startWithAddingDisclaimers(task, res)
{
  var disclaimersToAdd = 0;
  for (l = 0; l < task.disclaimers.length; l++)
  {
    console.log("Adding disclaimer: " + task.disclaimers[l]);
    api.addTaskDisclaimer(getAccessToken(), task.id, task.disclaimers[l],
      function(error, body, addedDisclaimers)
      {
        console.log("Finished adding disclaimer: " + task.disclaimers[l]);
        disclaimersToAdd++;
        if (disclaimersToAdd == task.disclaimers.length)
        {
          res.status(200).json(task);
        }
      }
    );
  }
}

function startWithDeletingDisclaimers(task, res, existingDisclaimers)
{
  var disclaimersToDelete = 0;
  for (k = 0; k < existingDisclaimers.length; k++)
  {
    console.log("Deleting disclaimer: " + existingDisclaimers[k].id);
    api.deleteTaskDisclaimer(getAccessToken(), task.id, existingDisclaimers[k].id,
      function(error, response, deletedDisclaimers)
      {
        console.log("Finished deleting disclaimer: " + existingDisclaimers[k].id);
        disclaimersToDelete++;
        if (disclaimersToDelete == existingDisclaimers.length)
        {
          if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
          {
            this.startWithAddingDisclaimers(task, res);
          }
          else
          {
            res.status(200).json(task);
          }
        }
      }
    }
  );
}

  function startWithGettingDisclaimers(task, res)
  {
    api.getTaskDisclaimers(getAccessToken(), task.id, 
      function(error, response, disclaimerBody)
      {
        disclaimerBody = JSON.parse(disclaimerBody);
        var existingDisclaimers = disclaimerBody.items;
        if (existingDisclaimers.length > 0)
        {
          this.startWithDeletingDisclaimers(task, res, existingDisclaimers);
        }
        else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
        {
          this.startWithAddingDisclaimers(task, res);
        }
        else
        {
          res.status(200).json(task);
        }
      }
    );
  }


  function startWithAddingSkills(task, res)
  {
    var skillsToAdd = 0;
    for (j = 0; j < task.skills.length; j++)
    {
      console.log("Adding skill: " + task.skills[j]);
      api.addTaskSkill(getAccessToken(), task.id, task.skills[j].id,
        function(error, response, addedSkills){
          console.log("Finished adding skill: " + task.skills[j]);
          skillsToAdd++;
          if (skillsToAdd == task.skills.length)
          {
            this.startWithGettingDisclaimers(task, res);
          }
        }
      );
    }
  }


  function startWithDeletingSkills(task, res, skills)
  {
    var skillsToDelete = 0;
    for (i = 0; i < skills.length; i++)
    {
      console.log("Deleting skill: " + skills[i].id);
      api.deleteTaskSkill(getAccessToken(), task.id, skills[i].id, 
        function(error, response, deletedSkills){
          console.log("Finished deleting skill: " + skills[i].id);
          skillsToDelete++;
          if (skillsToDelete == skills.length)
          {
            if (typeof task.skills != 'undefined' && task.skills.length > 0)
            {
              this.startWithAddingSkills(task, res);
            }
            else
            {
              this.startWithGettingDisclaimers(task, res);
            }
          }
        }
      );
    }
  }

  function startWithGettingSkills(task, res)
  {
    api.getTaskSkills(getAccessToken(), task.id, 
      function(error, response, bodySkill)
      {
        bodySkill = JSON.parse(body);
        var skills = body.items;
        if (skills.length > 0)
        {
          this.startWithDeletingSkills(task, res, skills);
        }
        else if (typeof task.skills != 'undefined' && task.skills.length > 0)
        {
          this.startWithAddingSkills(task, res);
        }
        else if (typeof task.skills == 'undefined')
        {
          this.startWithGettingDisclaimers(task, res);
        }
      }
    );
  }

  function editTask(task, res)
  {
    api.editTask(getAccessToken(), task, 
      function(error, response, body)
      {
        if (error)
        {
          console.log(error);
          res.status(404).send("Not Found");
        }

        this.startWithGettingSkills(task, res, startWithDeletingSkills);
      }
    });
  }