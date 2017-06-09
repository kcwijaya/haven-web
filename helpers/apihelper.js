var api = require(__dirname + "/oracle-api.js");

var ths = this;

exports.startWithAddingDisclaimersTask = function(task, res)
{
  var disclaimersToAdd = 0;
  for (l = 0; l < task.disclaimers.length; l++)
  {
    console.log("Adding disclaimer: " + task.disclaimers[l]);
    api.addTaskDisclaimer( task.id, task.disclaimers[l],
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

exports.startWithDeletingDisclaimersTask = function(task, res, existingDisclaimers)
{
  var disclaimersToDelete = 0;
  for (k = 0; k < existingDisclaimers.length; k++)
  {
    console.log("Deleting disclaimer: " + existingDisclaimers[k].id);
    api.deleteTaskDisclaimer( task.id, existingDisclaimers[k].id,
      function(error, response, deletedDisclaimers)
      {
        console.log("Finished deleting disclaimer: " + existingDisclaimers[disclaimersToDelete].id);
        disclaimersToDelete++;
        if (disclaimersToDelete == existingDisclaimers.length)
        {
          if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
          {
            ths.startWithAddingDisclaimersTask(  task, res);
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

exports.startWithGettingDisclaimersTask = function(task, res)
{
  api.getTaskDisclaimers( task.id, 
    function(error, response, disclaimerBody)
    {
      var existingDisclaimers = JSON.parse(disclaimerBody);
      if (existingDisclaimers.length > 0)
      {
        ths.startWithDeletingDisclaimersTask(  task, res, existingDisclaimers);
      }
      else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
      {
        ths.startWithAddingDisclaimersTask(  task, res);
      }
      else
      {
        res.status(200).json(task);
      }
    }
  );
}


exports.startWithAddingSkillsTask = function(task, res)
  {
    var skillsToAdd = 0;
    for (j = 0; j < task.skills.length; j++)
    {
      console.log("Adding skill: " + task.skills[j]);
      api.addTaskSkill( task.id, task.skills[j],
        function(error, response, addedSkills){
          if (error)
          {
            console.log("ERROR occured when adding skill " + task.skills[skillsToAdd]);
            console.log(error);
          }
          console.log("Finished adding skill: " + task.skills[skillsToAdd]);
          skillsToAdd++;
          if (skillsToAdd == task.skills.length)
          {
            if (typeof task.id != 'undefined' && task.id != '')
            {
              ths.startWithGettingDisclaimersTask(  task, res);
            }
            else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
            {
              ths.startWithAddingDisclaimersTask(  task, res);
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


exports.startWithDeletingSkillsTask = function(task, res, skills)
  {
    var skillsToDelete = 0;
    for (i = 0; i < skills.length; i++)
    {
      console.log("Deleting skill: " + skills[i].id);
      api.deleteTaskSkill( task.id, skills[i].id, 
        function(error, response, deletedSkills){
          console.log("Finished deleting skill: " + skills[skillsToDelete].id);
          skillsToDelete++;
          if (skillsToDelete == skills.length)
          {
            if (typeof task.skills != 'undefined' && task.skills.length > 0)
            {
              ths.startWithAddingSkillsTask(  task, res);
            }
            else
            {
              ths.startWithGettingDisclaimersTask(  task, res);
            }
          }
        }
      );
    }
  }

exports.startWithGettingSkillsTask = function(task, res)
  {
    console.log("Getting skills for ... " + task.id);
    api.getTaskSkills(task.id, 
      function(error, response, bodySkill)
      {
        var skills = JSON.parse(bodySkill);
        if (skills.length > 0)
        {
          ths.startWithDeletingSkillsTask(  task, res, skills);
        }
        else if (typeof task.skills != 'undefined' && task.skills.length > 0)
        {
          ths.startWithAddingSkillsTask( task, res);
        }
        else if (typeof task.skills == 'undefined')
        {
          ths.startWithGettingDisclaimersTask( task, res);
        }
      }
    );
  }

  exports.startWithAddingVolunteersTask = function(task, res)
  {
    var volsToAdd = 0;
    for (j = 0; j < task.volunteers.length; j++)
    {
      console.log("Adding volunteer: " + task.volunteers[j].id);
      api.addTaskVolunteer( task.volunteers[j].id, task.id, 
        function(error, response, addedSkills){
          console.log("Finished adding volunteer: " + task.volunteers[volsToAdd].id);
          volsToAdd++;
          if (volsToAdd == task.volunteers.length)
          {
            if (typeof task.id != 'undefined' && task.id != '')
            {
              ths.startWithGettingSkillsTask(  task, res);
            }
            else if (typeof task.skills != 'undefined' && task.skills.length > 0)
            {
              ths.startWithAddingSkillsTask(  task, res);
            }
            else if (typeof task.disclaimers != 'undefined' && task.disclaimers.length > 0)
            {
              ths.startWithAddingDisclaimersTask(  task, res);
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


  exports.startWithDeletingVolunteersTask = function(task, res, vols)
  {
    var volToDelete = 0;
    for (i = 0; i < vols.length; i++)
    {
      console.log("Deleting volunteer: " + vols[i].id);
      api.deleteTaskVolunteer( vols[i].id, task.id, 
        function(error, response, deletedVolunteers){
          console.log("Finished deleting volunteer: " + vols[volToDelete].id);
          volToDelete++;
          if (volToDelete == vols.length)
          {
            if (typeof task.volunteers != 'undefined' && task.volunteers.length > 0)
            {
              ths.startWithAddingVolunteersTask(  task, res);
            }
            else
            {
              ths.startWithGettingSkillsTask(  task, res);
            }
          }
        }
      );
    }
  }

  exports.startWithGettingVolunteersTask = function(task, res)
  {
    console.log("Getting volunteers for ... " + task.id);
    console.log(task);
    api.getTaskVolunteers(task.id, 
      function(error, response, body)
      {
        console.log(error);
        console.log(body);
        var body = JSON.parse(body);
        console.log(body);
        vols = body[0];

        console.log(task.volunteers);
        if (vols.length > 0)
        {
          ths.startWithDeletingVolunteersTask(task, res, vols);
        }
        else if (typeof task.volunteers != 'undefined' && task.volunteers.length > 0)
        {
          ths.startWithAddingVolunteersTask( task, res);
        }
        else if (typeof task.volunteers == 'undefined')
        {
          ths.startWithDeletingVolunteersTask( task, res);
        }
      }
    );
  }


exports.startWithAddingDisclaimersTemplate = function(template, res)
{
  var disclaimersToAdd = 0;
  for (l = 0; l < template.disclaimers.length; l++)
  {
    console.log("Adding disclaimer: " + template.disclaimers[l]);
    api.addTemplateDisclaimer( template.id, template.disclaimers[l],
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

exports.startWithDeletingDisclaimersTemplate = function(template, res, existingDisclaimers)
{
  var disclaimersToDelete = 0;
  for (k = 0; k < existingDisclaimers.length; k++)
  {
    console.log("Deleting disclaimer: " + existingDisclaimers[k].id);
    api.deleteTemplateDisclaimer( template.id, existingDisclaimers[k].id,
      function(error, response, deletedDisclaimers)
      {
        console.log("Finished deleting disclaimer: " + existingDisclaimers[disclaimersToDelete].id);
        disclaimersToDelete++;
        if (disclaimersToDelete == existingDisclaimers.length)
        {
          if (typeof template.disclaimers != 'undefined' && template.disclaimers.length > 0)
          {
            ths.startWithAddingDisclaimersTemplate( template, res);
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

exports.startWithGettingDisclaimersTemplate = function(  template, res)
  {
    api.getTemplateDisclaimers( template.id, 
      function(error, response, disclaimerBody)
      {
        var existingDisclaimers = JSON.parse(disclaimerBody);
        if (existingDisclaimers.length > 0)
        {
          ths.startWithDeletingDisclaimersTemplate( template, res, existingDisclaimers);
        }
        else if (typeof template.disclaimers != 'undefined' && template.disclaimers.length > 0)
        {
          ths.startWithAddingDisclaimersTemplate( template, res);
        }
        else
        {
          res.status(200).json(template);
        }
      }
    );
  }


exports.startWithAddingSkillsTemplate = function(  template, res)
  {
    var skillsToAdd = 0;
    for (j = 0; j < template.skills.length; j++)
    {
      console.log("Adding skill: " + template.skills[j]);
      api.addTemplateSkill( template.id, template.skills[j],
        function(error, response, addedSkills){
          console.log("Finished adding skill: " + template.skills[skillsToAdd]);
            skillsToAdd++;
        
          if (skillsToAdd == template.skills.length)
          {
            if (typeof template.id != 'undefined' && template.id != '')
            {
              ths.startWithGettingDisclaimersTemplate( template, res);
            }
            else if (typeof template.disclaimers != 'undefined' && template.disclaimers.length > 0)
            {
              ths.startWithAddingDisclaimersTemplate( template, res);
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


exports.startWithDeletingSkillsTemplate = function(  template, res, skills)
  {
    var skillsToDelete = 0;
    for (i = 0; i < skills.length; i++)
    {
      console.log("Deleting skill: " + skills[i].id);
      api.deleteTemplateSkill( template.id, skills[i].id, 
        function(error, response, deletedSkills){
          console.log("Finished deleting skill: " + skills[skillsToDelete].id);
            skillsToDelete++;
      
          if (skillsToDelete == skills.length)
          {
            if (typeof template.skills != 'undefined' && template.skills.length > 0)
            {
              ths.startWithAddingSkillsTemplate( template, res);
            }
            else
            {
              ths.startWithGettingDisclaimersTemplate( template, res);
            }
          }
        }
      );
    }
  }

exports.startWithGettingSkillsTemplate = function(template, res)
  {
    api.getTemplateSkills( template.id, 
      function(error, response, bodySkill)
      {
        var skills = JSON.parse(bodySkill);
        if (skills.length > 0)
        {
          ths.startWithDeletingSkillsTemplate(  template, res, skills);
        }
        else if (typeof template.skills != 'undefined' && template.skills.length > 0)
        {
          ths.startWithAddingSkillsTemplate(  template, res);
        }
        else if (typeof template.skills == 'undefined')
        {
          ths.startWithGettingDisclaimersTemplate(  template, res);
        }
      }
    );
  }