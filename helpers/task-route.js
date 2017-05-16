function startWithAddingDisclaimersTask(task, res)
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

function startWithDeletingDisclaimersTask(task, res, existingDisclaimers)
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
            startWithAddingDisclaimersTask(task, res);
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

  function startWithGettingDisclaimersTask(task, res)
  {
    api.getTaskDisclaimers(getAccessToken(), task.id, 
      function(error, response, disclaimerBody)
      {
        disclaimerBody = JSON.parse(disclaimerBody);
        var existingDisclaimers = disclaimerBody.items;
        if (existingDisclaimers.length > 0)
        {
          startWithDeletingDisclaimersTask(task, res, existingDisclaimers);
        }
        else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
        {
          startWithAddingDisclaimersTask(task, res);
        }
        else
        {
          res.status(200).json(task);
        }
      }
    );
  }


  function startWithAddingSkillsTask(task, res)
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
            startWithGettingDisclaimersTask(task, res);
          }
        }
      );
    }
  }


  function startWithDeletingSkillsTask(task, res, skills)
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
              startWithAddingSkillsTask(task, res);
            }
            else
            {
              startWithGettingDisclaimersTask(task, res);
            }
          }
        }
      );
    }
  }

  function startWithGettingSkillsTask(task, res)
  {
    api.getTaskSkills(getAccessToken(), task.id, 
      function(error, response, bodySkill)
      {
        bodySkill = JSON.parse(body);
        var skills = body.items;
        if (skills.length > 0)
        {
          startWithDeletingSkillsTask(task, res, skills);
        }
        else if (typeof task.skills != 'undefined' && task.skills.length > 0)
        {
          startWithAddingSkillsTask(task, res);
        }
        else if (typeof task.skills == 'undefined')
        {
          startWithGettingDisclaimersTask(task, res);
        }
      }
    );
  }