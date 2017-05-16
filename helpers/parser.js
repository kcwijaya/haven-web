exports.parseSkills = function(error, response, body, callback)
{
  if (error)
    {
      console.log(error);
      return;
    }

  body = JSON.parse(body);
  rawSkills = body.items;

  skillsGroup = {};

  for (i = 0; i < rawSkills.length; i++)
  {
    var skill = {
      name: rawSkills[i].id
    };

    if (rawSkills[i].custom != null)
    {
      skill.more = 'true';
      skill.label = rawSkills[i].custom;
      skill.moreID = rawSkills[i].id + "-more";
      skill.value = rawSkills[i].name;
    }
    else
    {
      skill.value = rawSkills[i].name;
    }

    if (!(rawSkills[i].category in skillsGroup))
    {
      skillsGroup[rawSkills[i].category] = [];
    }

    skillsGroup[rawSkills[i].category].push(skill);
  }

  var skillGroupOne = [];
  var skillGroupTwo = [];

  var numKeys = Object.keys(skillsGroup).length;

  for (i = 0; i < Math.ceil(numKeys/2); i++)
  {
    var groupName = Object.keys(skillsGroup)[i];
    skillGroupOne.push({groupName: groupName, skills: skillsGroup[groupName]});
  }
  for (i = Math.ceil(numKeys/2); i < numKeys; i++)
  {
    var groupName = Object.keys(skillsGroup)[i];
    skillGroupTwo.push({groupName: groupName, skills: skillsGroup[groupName]});
  }

  callback(skillGroupOne, skillGroupTwo);
}

exports.convertSeverity = function(level, toString)
{
  if (toString)
  {
    switch(level)
    {
      case 1: return 'Light';
      case 2: return 'Moderate';
      case 3: return 'Severe';
      default: return ' '
    }
  }
  else
  {
    switch(level)
    {
      case 'Light': return 1;
      case 'Moderate': return 2;
      case 'Severe': return 3;
      default: return 1;
    }
  }
}

exports.parseOneTask = function(body)
{
  body = JSON.parse(body);
  var tasks = body.items;
  var task = {};
  if (tasks.length > 0)
  {
    task = tasks[0];
  }

  task.severity = this.convertSeverity(task.severity_level, true);
  task.clock = this.formatDate(task.start_time);
  task.pageTitle = 'Haven - View Task';
  task.volunteers = [
    {first: "Kimberly", last: "Wijaya", phone: "(650) 490-0437", email: "kcwijaya@stanford.edu"}, 
    {first: "Maria", last: "Gutierrez", phone: "(650) 922-9534", email: "mariagtz@stanford.edu"}, 
    {first: "Belinda", last: "Esqueda", phone: "(714) 309-3607", email: "besqueda@stanford.edu"}, 
    {first: "Virgilio", last: "Urmenata", phone: "(650) 796-3148", email: "vurmenet@stanford.edu"}, 
    {first: "Sofi", last: "Arimany", phone: "(786) 338-8496", email: "asarimany@stanford.edu"}, 
  ];

  return task;
}

exports.parseOneTemplate = function(body)
{
  body = JSON.parse(body);
  var templates = body.items;
  var template = {};
  if (templates.length > 0)
  {
    template = templates[0];
  }

  return template;
}

exports.formatDate = function(date)
{
  var dateObj = new Date(date);
  return dateObj.toLocaleString();
}

exports.parseDisclaimers = function(error, response, body, callback){
  if (error)
  {
    console.log(error);
    return;
  }

  body = JSON.parse(body);
  var rawDisclaimers = body.items;

  var disclaimers = [];

  for (i = 0; i < rawDisclaimers.length; i++)
  {
    var disclaimer = {
      name: rawDisclaimers[i].id,
      value: rawDisclaimers[i].disclaimer,
      label: rawDisclaimers[i].disclaimer,
    };

    disclaimers.push(disclaimer);
  }

  callback(disclaimers);
}