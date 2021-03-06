var api = require(__dirname + "/oracle-api.js");

var ths = this;

exports.getUser = function getUser(req)
{
  var user = req.session.passport.user;
  if (typeof user == 'string')
  {
    user = JSON.parse(user);
  }

  return user;
}

exports.getFields = function getFields(input, callback)
{
  console.log("beginning");
  console.log(input);
  api.getSkills( function(error, response, body){
    ths.parseSkills(error, response, body, 
      function(one, two){
        api.getDisclaimers( function (error, response, body){
          ths.parseDisclaimers(error, response, body, 
            function(disclaimers){
              input.skillGroupsOne = one;
              input.skillGroupsTwo = two;
              input.disclaimers = disclaimers;
              console.log("GET FIELDS");
              console.log(input);
              callback(input);
            }
            );
        })
      });
  });
}


exports.parseSkills = function(error, response, body, callback)
{
  if (error)
    {
      console.log(error);
      return;
    }

  rawSkills = JSON.parse(body);

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

  var index = 0;
  var total = 0;
  for (i = 0; i < Object.keys(skillsGroup).length; i++)
  {
    var key = Object.keys(skillsGroup)[i];
    console.log("Key: " + key);
    total += skillsGroup[key].length;
    index++;
    if (total >= rawSkills.length/2)
    {
      break;
    }
  }

  for (i = 0; i < index; i++)
  {
    var groupName = Object.keys(skillsGroup)[i];
    skillGroupOne.push({groupName: groupName, skills: skillsGroup[groupName]});
  }
  for (i = index; i < numKeys; i++)
  {
    var groupName = Object.keys(skillsGroup)[i];
    skillGroupTwo.push({groupName: groupName, skills: skillsGroup[groupName]});
  }

  callback(skillGroupOne, skillGroupTwo);
}

exports.populateObject = function(task)
{
  var taskToAdd = {};
  if (typeof task.id != 'undefined')
  {
      taskToAdd.id = task.id;
  }

  if (typeof task.backgroundcheck != 'undefined')
  {
    taskToAdd.backgroundcheck = task.backgroundcheck;
  }
  
  if (typeof task.title != 'undefined')
  {
    taskToAdd.title = task.title;
  } 

  if (typeof task.location != 'undefined')
  {
    taskToAdd.location = task.location;
  } 


if (typeof task.latitude != 'undefined')
  {
    taskToAdd.latitude = task.latitude;
  } 


if (typeof task.longitude != 'undefined')
  {
    taskToAdd.longitude = task.longitude;
  } 


if (typeof task.description != 'undefined')
  {
    taskToAdd.description = task.description;
  } 


if (typeof task.instructions != 'undefined')
  {
    taskToAdd.instructions = task.instructions;
  } 


if (typeof task.num_volunteers != 'undefined')
  {
    taskToAdd.num_volunteers = task.num_volunteers;
  } 


if (typeof task.point_of_contact != 'undefined')
  {
    taskToAdd.point_of_contact = task.point_of_contact;
  } 

if (typeof task.start_time != 'undefined')
  {
    console.log(task.start_time);
    taskToAdd.start_time = ths.formatDate(task.start_time);
    console.log(taskToAdd.start_time);
  } 

if (typeof task.status != 'undefined')
  {
    taskToAdd.status = task.status;
  } 

if (typeof task.severity_id != 'undefined')
{
  taskToAdd.severity_id = task.severity_id;
}

  return taskToAdd;
}

exports.populateTask = function(task)
{
  var taskToAdd = ths.populateObject(task);

  taskToAdd.is_template = false;

  console.log(taskToAdd);
  return taskToAdd;
}

exports.populateTemplate = function(template)
{
  var templateToAdd = ths.populateObject(template);

  templateToAdd.is_template = true;
  console.log(templateToAdd);
  return templateToAdd;
}


exports.formatDate = function(date)
{
  if (typeof date == undefined)
  {
    return date;
  }

  date = new Date(date);
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  console.log(monthNames);
  console.log(monthNames[monthIndex]);

  return day + ' ' + monthNames[monthIndex] + ' ' + year + " " + hours + ":" + minutes;
}

exports.convertSeverity = function(level, toString)
{

  api.getSeverities(
    function(error, response, body){
      var sevs = JSON.parse(body);
      console.log(sevs);
      var dict = {};
      for (i = 0; i < sevs.length; i++)
      {
        if (toString)
        {
          dict[sevs[i].id] = sevs[i].severity_level;
        }
        else
        {
          dict[sevs[i].severity_level] = sevs[i].id;
        }
      }

      console.log("LEVEL: " + level);
      console.log(dict);
      console.log(dict[level]);
      return dict[level];
    }
  );
}

exports.parseOneTask = function(body)
{
  var task = JSON.parse(body);

  task.severity_level = this.convertSeverity(task.severity_level, true);
  task.clock = this.formatDate(task.start_time);
  // task['skills'] = body[3][0].map((skillsObj) => skillsObj['id']);
  // task['disclaimers'] = body[4][0].map((disclaimersObj) => disclaimersObj['name']);
  return task;
}

exports.parseAllTasks = function(body)
{
  items = [];
  numTasks = body[0].length;
  for (i = 0; i < numTasks; i ++)
  {
    task = body[0][i];
    task['org_name'] = body[2][i]['name'];
    task['skills'] = body[3][i].map((skillsObj) => skillsObj['id']);
    task['disclaimers'] = body[4][i].map((disclaimersObj) => disclaimersObj['name']);
    items.push(task);
  }

  return items;
}

exports.parseOneTemplate = function(body)
{
  body = JSON.parse(body);
  console.log(body);
  

  return body;
}


exports.parseDisclaimers = function(error, response, body, callback){
  if (error)
  {
    console.log(error);
    return;
  }

  var rawDisclaimers = JSON.parse(body);

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