var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var exphbs = require('express-handlebars');
var url = require('url');
var querystring = require('querystring');
var request = require('request');
var state = crypto.randomBytes(15).toString('hex');
var api = require(__dirname + "/helpers/oracle-api.js");
var apihelper = require(__dirname + "/helpers/apihelper.js");
var parser = require(__dirname + "/helpers/parser.js");
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

passport.use(new FacebookStrategy({
  clientID: '1013143872154300',
  clientSecret: 'bab2aee47233642619500e81e7b203ef',
  callbackURL: "http://havenweb.herokuapp.com/auth/facebook/callback",
  profileFields: ['id', 'birthday', 'email', 'first_name', 'last_name', 'gender']
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  api.getAdminByID(profile.id,
    function(error, response, body)
    {
      if (response.statusCode == 404)
      {
        console.log("DOESN'T EXIST");

        api.getOrganizations(
          function(error, response, body){
            body = JSON.parse(body);
            var org = body[0].id;
            console.log('USER NOT FOUND!!!\n');
            var user = {
              id: profile.id, 
              first_name: profile._json.first_name,
              last_name: profile._json.last_name, 
              email: profile._json.email,
              organization_id: org
            }

            console.log("USER: " + JSON.stringify(user));
            api.addAdmin(user,
              function(error, response, body){
                if (error)
                {
                  console.log(error);
                  done(error, user);
                }

                console.log("Body: ");
                console.log(body);

                console.log(response.statusCode);
                done(null, user);
              }
              );
          });       
      }
      else
      {
        done(null, body);
      }
    }
    );
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});




app.use(cookieSession({
  name: 'session',
  keys: ['1', '2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_birthday']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
    failureRedirect: '/' }));



var hbs = exphbs.create({
  helpers: {
    equal: function(lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if( lvalue!=rvalue ) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
    list: function(context, options) {
      var ret = "<ul>";
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + "<li>" + options.fn(context[i]) + "</li>";
      }
      return ret + "</ul>";
    },
    listnowrap: function(context, options) {
     var ret = "";
     for(var i=0, j=context.length; i<j; i++) {
      ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }
    return ret;
  }
},
extname: '.html',
partialsDir: "views/partials/",
layoutsDir: "views/layouts/",
defaultLayout: 'main'
});

app.engine('html', hbs.engine);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// var AuthMiddleware = function(req, res, next) {
//   if (req.path == '/')
//   {
//     return next();
//   }

//   if (req.isAuthenticated())
//   {
//     return next();
//   }
//   else
//   {
//     return res.redirect('/');
//   }
// }


// app.use(AuthMiddleware);


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function getUser(req)
{
  var user = req.session.passport.user;
  if (typeof user == 'string')
  {
    user = JSON.parse(user);
  }

  return user;
}
app.get('/', function(req, res) {
  if (req.isAuthenticated())
  {
    if (typeof req.session.org != 'undefined')
    {
      var user = getUser(req);
      console.log(user);

      req.session.passport.user.organization_id = req.session.org; 
      var edit = {
        organization_id: req.session.org,
        id: user.id
      }

      console.log("editing organization...");
      console.log(edit);
      api.editAdmin(edit, 
        function(error, response, body){
          console.log(body);
          var user = getUser(req);
          res.render('home-auth', {pageTitle: 'Haven - Home', name: user.first_name});
        }
      );
    }
    else
    {
       var user = getUser(req);
      res.render('home-auth', {pageTitle: 'Haven - Home', name: user.first_name});
    }
  }
  else
  {
    res.sendFile(__dirname+ '/Homepage.html');
  }
});


app.get('/home', function(req, res) {
  if (req.isAuthenticated())
  {
       var user = getUser(req);
      res.render('home-auth', {pageTitle: 'Haven - Home', name: user.first_name});
  }
  else
  {
    res.sendFile(__dirname+ '/Homepage.html');
  }});

app.post('/review-new', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  return res.render('review', req.body);
});

app.post('/review-task', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  console.log(req.body);
  return res.render('task-review', req.body);
});

app.post('/review-template', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  return res.render('template-review', req.body);
});


app.post('/login', function(req, res){
  res.redirect('/create');
});

app.get('/handlebars/*', function(req, res){
  res.sendFile(__dirname + req.url);
});

app.get('/bower_components/*', function(req, res){
  res.sendFile(__dirname + req.url);
});

app.get('/stylesheets/*', function(req, res) {
  res.sendFile(__dirname + req.url);
});

app.get('/tasks/view', function(req, res){
  console.log("ID:" + req.query.id);
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
          console.log(sevs);
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
                    console.log(body[1][i]);
                    task.volunteers[i].hours = body[1][i].hours;
                    if (task.volunteers[i].hours == null)
                    {
                      task.volunteers[i].hours = 0;
                    }
                  }
                }

                console.log(task.volunteers);
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

app.get('/hello', function(req, res){


});

app.get('/favicons/*', function(req, res){
  res.sendFile(__dirname + req.url);
});

app.get('/create', function(req, res) {
  res.sendFile(__dirname + '/TaskCreationHome.html');
});

app.get('/signup', function(req, res){
  console.log('org: ' + req.query.org);
  var org = req.query.org;
  req.session.org = org;

  res.redirect("/auth/facebook");

});

app.get('/views/*', function(req, res) {
  res.sendFile(__dirname + req.url);
})

app.get('/templates', function(req, res){
  res.sendFile(__dirname + '/BrowseTemplates.html');
});

app.get('/tasks', function(req, res){
  //res.render('task-browse', {pageTitle: 'Haven - Browse Tasks'});
  res.sendFile(__dirname + '/BrowseTasks.html');
});






app.post('/save-task', function(req, res){
  console.log("Saving task from edit!");

  console.log(req.body);
  var task = parser.populateTask(req.body);

  var user = getUser(req);
   api.getSeverities(
    function(error, response, body){
      var sevs = JSON.parse(body);
      var dict = {};
      for (i = 0; i < sevs.length; i++)
      {
        dict[sevs[i].severity_level] = sevs[i].id;
      }

      console.log("OLD SEVERITY " + task.severity_id);

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


      console.log("SAVING TASK!!!!!!!!!!!!");

      console.log(task);

      api.editTask(task, 
        function(error, response, body)
        {
          console.log("Finished posting the task!");
          if (error)
          {
            console.log(error);
            res.status(404).send("Not Found");
          }

          console.log(body);
          console.log("volunteers");
          console.log(req.body.volunteers);

          apihelper.startWithGettingVolunteersTask(req.body, res);

         // apihelper.startWithGettingSkillsTask(req.body, res);
        }
      );
    }
  );
});

app.get("/volunteers", function(req, res){
  var user = getUser(req);
  console.log("#########GETTING ALL TASKS FOR: " + user.organization_id);
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

        console.log("#### GETTING VOLUNTEERS FOR " + actualTasks[i].id);
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


app.post('/post-task', function(req, res){
  console.log("Req body ");
  console.log(req.body);
  var taskToAdd =  parser.populateTask(req.body);
  taskToAdd.id = undefined;
  console.log(taskToAdd);

  var task = req.body;

  var user = getUser(req);

  console.log(user);

  if (typeof user == 'string')
  {
    user = JSON.parse(req.session.passport.user);
  }

  console.log(user);
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


      console.log("#####ADDING TASK: ");
      console.log(taskToAdd);
      api.addNewTask(taskToAdd, 
        function(error, response, body){
          if (error)
          {
            console.log(error);
            res.status(404).send("Not Found");
          }


          console.log("Just added task.");
          console.log(body);
          var id = body.id;

          console.log("NEWLY ADDED ID: " + id);

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

app.post('/save-changes', function(req, res){
  res.status(200);
  res.json(req.body);
});


app.get('/properties', function(req, res){
  var result = { pageTitle: 'Haven - Create Skills and Disclaimers'};
  api.getSkills(
  function(error, response, body)
  {
    var skills = JSON.parse(body);
    api.getDisclaimers(
      function(error, response, body){
        var disclaimers = JSON.parse(body);

        result.skills = skills;
        result.disclaimers = disclaimers;
        res.render('createskills', result);

    });
  }
  );
});

app.post('/save-template', function(req, res){

  var template = parser.populateTemplate(req.body);
  var user = getUser(req);
  template.admin_id = parseInt(user.id);
  template.start_time = parser.formatDate(new Date(Date.now()));

  template.organization_id = user.organization_id;

  if (typeof template.num_volunteers != 'undefined')
  {
    template.num_volunteers = parseInt(template.num_volunteers);
  }
  if (typeof template.latitude != 'undefined')
  {
    template.latitude = parseFloat(template.latitude);
  }
  if (typeof template.longitude != 'undefined')
  {
    template.longitude = parseFloat(template.longitude);
  }

  api.editTemplate(template, 
    function(error, response, body)
    {
      if (error)
      {
        res.status(404).send("Not Found");
      }

      if (typeof req.body.skills != 'undefined' && req.body.skills.length > 0) {
        apihelper.startWithGettingSkillsTemplate(req.body, res);
      }
      else if (typeof req.body.disclaimers != 'undefined' && req.body.disclaimers.length > 0)
      {
        apihelper.startWithGettingDisclaimersTemplate(req.body, res);
      }
      else
      {
        res.status(200).json(task);
      }
   }
  );
});

app.post('/save-new-template', function(req, res){
  var template = parser.populateTemplate(req.body);
  template.start_time = parser.formatDate(new Date(Date.now()));
  console.log(req.session.passport.user);
  var user = getUser(req);
  template.admin_id = parseInt(user.id);

  console.log(template);

  if (typeof template.num_volunteers != 'undefined')
  {
    template.num_volunteers = parseInt(template.num_volunteers);
  }
  if (typeof template.latitude != 'undefined')
  {
    template.latitude = parseFloat(template.latitude);
  }
  if (typeof template.longitude != 'undefined')
  {
    template.longitude = parseFloat(template.longitude);
  }

  api.getSeverities(
    function(error, response, body){
      var sevs = JSON.parse(body);
      template.severity_id = sevs[0].id;
      template.organization_id = user.organization_id;
      api.addNewTemplate(template, 
        function(error, response, body)
        {
          if (error)
          {
            console.log(error)
            res.status(404).send("Not Found");
          }

          console.log(body);
          console.log(response.statusCode);
          console.log("TEMPLATE ID: " + body.id);

          req.body.id = body.id;

          if (typeof req.body.skills != 'undefined' && req.body.skills.length > 0) {
            apihelper.startWithGettingSkillsTemplate(req.body, res);
          }
          else if (typeof req.body.disclaimers != 'undefined' && req.body.disclaimers.length > 0)
          {
            apihelper.startWithGettingDisclaimersTemplate(req.body, res);
          }
        }
        );
      }
    );
});

  

function getFields(input, callback)
{
  console.log("beginning");
  console.log(input);
  api.getSkills( function(error, response, body){
    parser.parseSkills(error, response, body, 
      function(one, two){
        api.getDisclaimers( function (error, response, body){
          parser.parseDisclaimers(error, response, body, 
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

app.get('/create/new', function(req, res) {
  if (typeof req.query.id == 'undefined')
  {
    getFields(req.query, function(result){
      result.pageTitle = "Haven - Create";
      result.newBtn = true;
      var user = getUser(req);
      result.username = user.name;
      console.log("Username: " + result.username);
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

      getFields(body, function(result){
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
      console.log(body);
      getFields(body, function(result){
        result.pageTitle = "Haven - Create";
        result.newBtn = true;
        result.templateBtn = true;
        res.render('task-create', result);
      });
    });
}

});

app.get('/templates/view', function(req, res){
  var templateID = req.query.id;
  console.log("templateID: " + templateID);

  api.getTemplateByID(templateID,
    function(error, response, body)
    {
      var template = parser.parseOneTemplate(body);
      template.pageTitle = "Haven - View Template";
      res.render('template-details', template);
    }
  );
});

app.get('/templates/edit', function(req, res) {
  var templateID = req.query.id;
  
  console.log("templateID: " + templateID);

  api.getTemplateByID(templateID, 
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send('Not Found');
      }
      console.log("TEMPLATES");
      console.log(body);

      var template = parser.parseOneTemplate(body);

      console.log(template);
      getFields(template, function(result){
        result.pageTitle = "Haven - Edit Template";
        console.log(result);
        res.render('template-edit', result);
      });

    }
    );
});

app.get('/templates/new', function(req, res){
 getFields({}, function(result){
  result.pageTitle = "Haven - Create Template";
  res.render('template-edit', result);
});

});

app.get('/tasks/hours', function(req, res){
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
          console.log(body[1][i]);
          task.volunteers[i].hours = body[1][i].hours;
          if (task.volunteers[i].hours == null)
          {
            task.volunteers[i].hours = 0;
          }
        }
      }

      console.log("VOLUNTEERS: ");
      console.log(task.volunteers);
      task.pageTitle = "Haven - Log Hours";
      res.render('log-hours', task);
    }
    );
});

app.post('/tasks/hours', function(req, res){
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
      console.log(body);
      console.log("Adding " + hours + " to V#" + volunteerID + " for T#" + taskID);
      res.json(body);
    });
  
});

app.get('/tasks/edit', function(req, res) {
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
          console.log(task.volunteers);

          for (i = 0; i < task.volunteers.length; i++)
          {
            var hours = body[1][i].hours;
            if (hours == null)
            {
              hours = 0;
            }

            task.volunteers[i].hours = hours;
          }
          getFields(task, function(result){
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

let transporter = nodemailer.createTransport({
  service: 'Yahoo',
  auth: {
    user: 'teamhaven@yahoo.com',
    pass: 'oraclemobile1'
  }
});

app.get('/asdf', function(req, res){
  res.render('error', {error: "alsdjflasdjflkasjdflasdjfalsdf"});
});

app.post('/signup', function(req, res){
  // var token = crypto.randomBytes(15).toString('hex');

  // console.log(req.body.email);
  // console.log(req.body);
  // mailOptions = {
  //   from: '"Team Haven" <teamhaven@yahoo.com>',
  //   to: req.body.email, 
  //   subject: 'Confirm your email to activate your Haven account',
  //   text: 'Hello ' + req.body.firstName + ',\n\n Thanks for joining Haven! \n\nEnter the following code on our page to activate your account: \n\n' + token + '\n\n. We hope you are excited to join us as we are to have you. \n\n Cheers, \n Team Haven',
  //   html: '<div style="font-weight: ' + "'lighter'" + 'font-family: Century Gothic"><img src="https://drive.google.com/file/d/0B9FhdwzD65zyM0xjX2FnWXdhNkk/view?usp=sharing" style="width: 15rem"/> <h2> Hello ' + req.body.firstName + ',<br><br></h2> <h3>Thanks for joining Haven! Enter the following code on our page to activate your account:<br><br><b><span style="text-align=' + "'center'; " + 'color: #33cccc">' + token + '</span></b><br><br>We hope you are excited to join us as we are to have you. <br> <br>Cheers, </h3><h2 style="color:"' +'"#33cccc">Team Haven </h2></div>'
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log(info);
  //   console.log("Message %s sent: %s", info.messageId, info.response);
  // });


  // res.sendFile(__dirname + '/CreateAccountConfirmation.html');
  var user = 
  {
    first_name: req.body.firstName, 
    last_name: req.body.lastName, 
    email: req.body.email, 
    organization_id: req.body.organization
  }
  api.addAdmin(user,
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).render('error', {error: error});
      }

      res.redirect("/create");
    }
    );
});


app.get('/imgs/*', function(req, res)
{
  res.sendFile(__dirname + req.url);
});

app.get('*/scripts/*', function(req, res)
{
  res.sendFile(__dirname + req.url);
});

app.get('/tasks/id', function(req, res) {
  var id = req.query.id;

  api.getTaskByID( id,
    function(error, response, body)
    {
      var task = parser.parseOneTask(body);
      res.json(task);
    }
    );
});

app.get('/tasks/all', function(req, res) {
  var user = getUser(req);
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

app.get('/templates/all', function(req, res){
  var user = getUser(req);
  console.log("#########GETTING ALL TEMPLATES FOR: " + user.organization_id);

  api.getAllTemplates(
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }
      body = JSON.parse(body);
      console.log(body[0]);
      var templates = [];
      for (i = 0; i < body[0].length; i++)
      {
        console.log(body[0][i].is_template);
        if (body[0][i].is_template)
        {
          templates.push(body[0][i]);
        }
      }
      res.json(templates);
   }
   );
});

app.get('/tasks/skills', function(req, res){
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

app.get('/tasks/disclaimers', function(req, res){
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


app.get('/templates/skills', function(req, res){
  var id = req.query.id;

  console.log(id);
  api.getTemplateSkills( id,
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

app.get('/templates/disclaimers', function(req, res){
  var id = req.query.id;
  console.log('ID: ' + id);
  api.getTemplateDisclaimers( id,
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

app.get('/users/all', function(req, res){
  api.getUsers( 
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

app.get('/tasks/delete', function(req, res){
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

app.get('/tasks/volunteers', function(req, res){
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

app.post('/orgs', function(req, res){
  console.log(req.body);
  api.addOrganization(req.body, 
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found.");
      }

      console.log(body);
      res.json(body);
    }
    );
});

app.get('/orgs', function(req, res){
  api.getOrganizations(
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");
      }

      body = JSON.parse(body);
      console.log(body);
      console.log(body.length);
      res.json(body);
    });
});

app.get('/org', function(req, res){
  var id = req.query.id;
  api.getOrganizationByID( id,
    function(error,response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");
      }
      body = JSON.parse(body);
      res.json(body);
    })
});

app.get('/skillCategories', function(req, res){
  api.getSkills(
    function(error, response, body){
      var skills = JSON.parse(body);
      var categories = [];
      for (i = 0; i < skills.length; i++)
      {
        if (categories.indexOf(skills[i].category) == -1)
        {
          categories.push(skills[i].category);
        }
      }

      res.json(categories);
    }
  );
});

app.post('/createSkill', function(req, res){
  api.addSkill(req.body, 
    function(error, response, body)
    {
      res.json(body);
    });
})

app.post('/createDisclaimer', function(req, res){
  api.addDisclaimer(req.body, 
    function(error, response, body)
    {
      res.json(body);
    });
})


http.listen(process.env.PORT || 5000, function() {
  console.log('listening on ' + process.env.PORT || 5000);
});


