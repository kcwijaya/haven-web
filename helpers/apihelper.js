var api = require(__dirname + "/oracle-api.js");

var ths = this;

function getAccessToken(token)
{
  if (token.expired()) {
    token.refresh((error, result) => {
      token = oauth2.accessToken.create(result);
    });
  }
  return token.token.access_token;
}

exports.startWithAddingDisclaimersTask = function(token, task, res)
{
  var disclaimersToAdd = 0;
  for (l = 0; l < task.disclaimers.length; l++)
  {
    console.log("Adding disclaimer: " + task.disclaimers[l]);
    api.addTaskDisclaimer(getAccessToken(token), task.id, task.disclaimers[l],
      function(error, body, addedDisclaimers)
      {
        console.log("Finished adding disclaimer: " + task.disclaimers[disclaimersToAdd]);
        disclaimersToAdd++;
        if (disclaimersToAdd == task.disclaimers.length)
        {
          res.status(200).json(task);
        }
      }
    );
  }
}

exports.startWithDeletingDisclaimersTask = function(token, task, res, existingDisclaimers)
{
  var disclaimersToDelete = 0;
  for (k = 0; k < existingDisclaimers.length; k++)
  {
    console.log("Deleting disclaimer: " + existingDisclaimers[k].id);
    api.deleteTaskDisclaimer(getAccessToken(token), task.id, existingDisclaimers[k].id,
      function(error, response, deletedDisclaimers)
      {
        console.log("Finished deleting disclaimer: " + existingDisclaimers[disclaimersToDelete].id);
        disclaimersToDelete++;
        if (disclaimersToDelete == existingDisclaimers.length)
        {
          if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
          {
            ths.startWithAddingDisclaimersTask(token, task, res);
          }
          else
          {
            res.status(200).json(task);
          }
        }
      }
    );
  }
}

exports.startWithGettingDisclaimersTask = function(token, task, res)
{
  api.getTaskDisclaimers(getAccessToken(token), task.id, 
    function(error, response, disclaimerBody)
    {
      disclaimerBody = JSON.parse(disclaimerBody);
      var existingDisclaimers = disclaimerBody.items;
      if (existingDisclaimers.length > 0)
      {
        ths.startWithDeletingDisclaimersTask(token, task, res, existingDisclaimers);
      }
      else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
      {
        ths.startWithAddingDisclaimersTask(token, task, res);
      }
      else
      {
        res.status(200).json(task);
      }
    }
  );
}


exports.startWithAddingSkillsTask = function(token, task, res)
  {
    var skillsToAdd = 0;
    for (j = 0; j < task.skills.length; j++)
    {
      console.log("Adding skill: " + task.skills[j]);
      api.addTaskSkill(getAccessToken(token), task.id, task.skills[j],
        function(error, response, addedSkills){
          console.log("Finished adding skill: " + task.skills[skillsToAdd]);
          skillsToAdd++;
          if (skillsToAdd == task.skills.length)
          {
            if (typeof task.id != 'undefined' && task.id != '')
            {
              ths.startWithGettingDisclaimersTask(token, task, res);
            }
            else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
            {
              ths.startWithAddingDisclaimersTask(token, task, res);
            }
            else
            {
              res.status(200).json(task);
            }
          }
        }
      );
    }
  }


exports.startWithDeletingSkillsTask = function(token, task, res, skills)
  {
    var skillsToDelete = 0;
    for (i = 0; i < skills.length; i++)
    {
      console.log("Deleting skill: " + skills[i].id);
      api.deleteTaskSkill(getAccessToken(token), task.id, skills[i].id, 
        function(error, response, deletedSkills){
          console.log("Finished deleting skill: " + skills[skillsToDelete].id);
          skillsToDelete++;
          if (skillsToDelete == skills.length)
          {
            if (typeof task.skills != 'undefined' && task.skills.length > 0)
            {
              ths.startWithAddingSkillsTask(token, task, res);
            }
            else
            {
              ths.startWithGettingDisclaimersTask(token, task, res);
            }
          }
        }
      );
    }
  }

exports.startWithGettingSkillsTask = function(token, task, res)
  {
    console.log("Getting skills for ... " + task.id);
    api.getTaskSkills(getAccessToken(token), task.id, 
      function(error, response, bodySkill)
      {
        bodySkill = JSON.parse(bodySkill);
        var skills = bodySkill.items;
        if (skills.length > 0)
        {
          ths.startWithDeletingSkillsTask(token, task, res, skills);
        }
        else if (typeof task.skills != 'undefined' && task.skills.length > 0)
        {
          ths.startWithAddingSkillsTask(token,task, res);
        }
        else if (typeof task.skills == 'undefined')
        {
          ths.startWithGettingDisclaimersTask(token,task, res);
        }
      }
    );
  }

  exports.startWithAddingVolunteersTask = function(token, task, res)
  {
    var volsToAdd = 0;
    for (j = 0; j < task.volunteers.length; j++)
    {
      console.log("Adding volunteer: " + task.volunteers[j].id);
      api.addTaskVolunteer(getAccessToken(token), task.volunteers[j].id, task.id, 
        function(error, response, addedSkills){
          console.log("Finished adding volunteer: " + task.volunteers[volsToAdd].id);
          volsToAdd++;
          if (volsToAdd == task.volunteers.length)
          {
            if (typeof task.id != 'undefined' && task.id != '')
            {
              ths.startWithGettingSkillsTask(token, task, res);
            }
            else if (typeof task.skills != 'undefined' && task.skills.length > 0)
            {
              ths.startWithAddingSkillsTask(token, task, res);
            }
            else if (typeof task.disclaimers != 'udnefined' && task.disclaimers.length > 0)
            {
              ths.startWithAddingDisclaimersTask(token, task, res);
            }
            else
            {
              res.status(200).json(task);
            }
          }
        }
      );
    }
  }


  exports.startWithDeletingVolunteersTask = function(token, task, res, vols)
  {
    var volToDelete = 0;
    for (i = 0; i < vols.length; i++)
    {
      console.log("Deleting volunteer: " + vols[i].id);
      api.deleteTaskVolunteer(getAccessToken(token), vols[i].id, task.id, 
        function(error, response, deletedVolunteers){
          console.log("Finished deleting volunteer: " + vols[volToDelete].id);
          volToDelete++;
          if (volToDelete == vols.length)
          {
            if (typeof task.volunteers != 'undefined' && task.volunteers.length > 0)
            {
              ths.startWithAddingVolunteersTask(token, task, res);
            }
            else
            {
              ths.startWithGettingSkillsTask(token, task, res);
            }
          }
        }
      );
    }
  }

  exports.startWithGettingVolunteersTask = function(token, task, res)
  {
    console.log("Getting volunteers for ... " + task.id);
    api.getTaskVolunteers(getAccessToken(token), task.id, 
      function(error, response, body)
      {
        body = JSON.parse(body);
        var vols = body.items;
        if (vols.length > 0)
        {
          ths.startWithDeletingVolunteersTask(token, task, res, vols);
        }
        else if (typeof task.volunteers != 'undefined' && task.volunteers.length > 0)
        {
          ths.startWithAddingVolunteersTask(token,task, res);
        }
        else if (typeof task.volunteers == 'undefined')
        {
          ths.startWithGettingSkillsTask(token,task, res);
        }
      }
    );
  }


exports.startWithAddingDisclaimersTemplate = function(token,template, res)
{
  var disclaimersToAdd = 0;
  for (l = 0; l < template.disclaimers.length; l++)
  {
    console.log("Adding disclaimer: " + template.disclaimers[l]);
    api.addTemplateDisclaimer(getAccessToken(token), template.id, template.disclaimers[l],
      function(error, body, addedDisclaimers)
      {
        console.log("Finished adding disclaimer: " + template.disclaimers[disclaimersToAdd]);
        disclaimersToAdd++;
        if (disclaimersToAdd == template.disclaimers.length)
        {
          res.status(200).json(template);
        }
      }
    );
  }
}

exports.startWithDeletingDisclaimersTemplate = function(token,template, res, existingDisclaimers)
{
  var disclaimersToDelete = 0;
  for (k = 0; k < existingDisclaimers.length; k++)
  {
    console.log("Deleting disclaimer: " + existingDisclaimers[k].id);
    api.deleteTemplateDisclaimer(getAccessToken(token), template.id, existingDisclaimers[k].id,
      function(error, response, deletedDisclaimers)
      {
        console.log("Finished deleting disclaimer: " + existingDisclaimers[disclaimersToDelete].id);
        disclaimersToDelete++;
        if (disclaimersToDelete == existingDisclaimers.length)
        {
          if (typeof template.disclaimers != 'undefined' && template.disclaimers.length > 0)
          {
            ths.startWithAddingDisclaimersTemplate(token,template, res);
          }
          else
          {
            res.status(200).json(template);
          }
        }
      }
    );
  }
}

exports.startWithGettingDisclaimersTemplate = function(token, template, res)
  {
    api.getTemplateDisclaimers(getAccessToken(token), template.id, 
      function(error, response, disclaimerBody)
      {
        disclaimerBody = JSON.parse(disclaimerBody);
        var existingDisclaimers = disclaimerBody.items;
        if (existingDisclaimers.length > 0)
        {
          ths.startWithDeletingDisclaimersTemplate(token,template, res, existingDisclaimers);
        }
        else if (typeof template.disclaimers != 'undefined' && template.disclaimers.length > 0)
        {
          ths.startWithAddingDisclaimersTemplate(token,template, res);
        }
        else
        {
          res.status(200).json(template);
        }
      }
    );
  }


exports.startWithAddingSkillsTemplate = function(token, template, res)
  {
    var skillsToAdd = 0;
    for (j = 0; j < template.skills.length; j++)
    {
      console.log("Adding skill: " + template.skills[j]);
      api.addTemplateSkill(getAccessToken(token), template.id, template.skills[j].id,
        function(error, response, addedSkills){
          console.log("Finished adding skill: " + template.skills[skillsToAdd]);
            skillsToAdd++;
        
          if (skillsToAdd == template.skills.length)
          {
            if (typeof template.id != 'undefined' && template.id != '')
            {
              ths.startWithGettingDisclaimersTemplate(token,template, res);
            }
            else if (typeof template.disclaimers != 'undefined' && template.disclaimers.length > 0)
            {
              ths.startWithAddingDisclaimersTemplate(token,template, res);
            }
            else
            {
              res.status(200).json(template);
            }
          }
        }
      );
    }
  }


exports.startWithDeletingSkillsTemplate = function(token, template, res, skills)
  {
    var skillsToDelete = 0;
    for (i = 0; i < skills.length; i++)
    {
      console.log("Deleting skill: " + skills[i].id);
      api.deleteTemplateSkill(getAccessToken(token), template.id, skills[i].id, 
        function(error, response, deletedSkills){
          console.log("Finished deleting skill: " + skills[skillsToDelete].id);
            skillsToDelete++;
      
          if (skillsToDelete == skills.length)
          {
            if (typeof template.skills != 'undefined' && template.skills.length > 0)
            {
              ths.startWithAddingSkillsTemplate(token,template, res);
            }
            else
            {
              ths.startWithGettingDisclaimersTemplate(token,template, res);
            }
          }
        }
      );
    }
  }

exports.startWithGettingSkillsTemplate = function(token, template, res)
  {
    api.getTemplateSkills(getAccessToken(token), template.id, 
      function(error, response, bodySkill)
      {
        bodySkill = JSON.parse(bodySkill);
        var skills = bodySkill.items;
        if (skills.length > 0)
        {
          ths.startWithDeletingSkillsTemplate(token, template, res, skills);
        }
        else if (typeof template.skills != 'undefined' && template.skills.length > 0)
        {
          ths.startWithAddingSkillsTemplate(token, template, res);
        }
        else if (typeof template.skills == 'undefined')
        {
          ths.startWithGettingDisclaimersTemplate(token, template, res);
        }
      }
    );
  }