global.XMLHttpRequest = require("xhr2").XMLHttpRequest;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


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
var auth = require(__dirname + "/helpers/auth.js");
const oauth2 = require('simple-oauth2').create(auth.credentials);

// Globals
var authCode = "";
var tokenConfig = {};
var token = {};
var processing = false;


var AuthMiddleware = function(req, res, next) {
  if (req.url.includes('callback'))
  {
    next();
    return;
  }
  if ((authCode == "" || token == {}) && !processing)
  {
   processing = true;
   res.redirect(oauth2.authorizationCode.authorizeURL({
    state: state
  }));
   return;
  }
 next(); 
}

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

app.use(AuthMiddleware);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/TaskCreationHome.html');
});

function getAccessTokenObject()
{
  oauth2.authorizationCode.getToken(tokenConfig, (error, result) => {
    if (error){
      console.log("ERROR: ");
      return console.log('Access Token Error: ', error.message);
    }
    token = oauth2.accessToken.create(result);
    console.log(token);

    console.log(token.expired());

  });
}

function getAccessToken()
{
  //console.log("TOKEN: ");
  //console.log(token);
  if (token.expired()) {
    token.refresh((error, result) => {
      console.log("#######REFRESHED##########");
      console.log(token);
      token = oauth2.accessToken.create(result);
    });
  }
  return token.token.access_token;
}

function getAccessTokenObj()
{
  return token;
}

app.get('/callback', function(req, res){
  if (authCode == "")
  {
    authCode = req.query.code;
  } 

  tokenConfig.code = authCode;
  getAccessTokenObject();

  res.redirect('/');
});

app.get('/home', function(req, res) {
  res.sendFile(__dirname + '/TaskCreationHome.html');
});

app.post('/review-new', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  return res.render('review', req.body);
});

app.post('/review-task', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
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
  api.getTaskByID(getAccessToken(), req.query.id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
        res.status(404).send('Not found');
      }

      var task = parser.parseOneTask(body);

      api.getTaskVolunteers(getAccessToken(), req.query.id, 
        function(error, response, body)
        {
          body = JSON.parse(body);
          task.volunteers = body.items;
          res.render('task-details', task);

        }
      )
    }
    );
});

app.get('/hello', function(req, res){
  console.log(api.getAllTasks(getAccessToken()));
});

app.get('/create', function(req, res) {
  res.sendFile(__dirname + '/TaskCreationHome.html');
});

app.get('/views/*', function(req, res) {
  res.sendFile(__dirname + req.url);
})

app.get('/templates', function(req, res){
  res.sendFile(__dirname + '/BrowseTemplates.html');
});

app.get('/tasks', function(req, res){
  res.sendFile(__dirname + '/BrowseTasks.html');
});



app.post('/save-task', function(req, res){
  var task = req.body;
  task.creator_id = 21;
  task.organization = 1;
  task.status = 'scheduled';
  task.severity = parser.convertSeverity(task.severity, false);

  api.editTask(getAccessToken(), task, 
      function(error, response, body)
      {
        if (error)
        {
          console.log(error);
          res.status(404).send("Not Found");
        }

        if (typeof task.volunteers != 'undefined' && task.volunteers.length > 0)
        {
          apihelper.startWithGettingVolunteersTask(getAccessTokenObj(), task, res);
        }
        else
        {
          apihelper.startWithGettingSkillsTask(getAccessTokenObj(), task, res);
        }
      }
  );
});


app.post('/post-task', function(req, res){
  var task = req.body;
  task.creator_id = 21;
  task.organization = 1;
  task.status = 'scheduled';
  task.severity = parser.convertSeverity(task.severity, false);

  console.log(task);
  api.addNewTask(getAccessToken(), task, 
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send("Not Found");
      }

      console.log("Just added task.");
      var id = response.headers.id;
      console.log(id);
      console.log(response.headers);
      task.id = id;

      apihelper.startWithAddingSkillsTask(getAccessTokenObj(), task, res);
    }
  );
});

app.post('/save-changes', function(req, res){
  res.status(200);
  res.json(req.body);
});

app.post('/save-template', function(req, res){
  var id = req.body.id;

  if (typeof id != 'undefined' && id != '')
  {
    api.editTemplate(getAccessToken(), req.body, 
      function(error, response, body)
      {
        if (error)
        {
          console.log(error);
          res.status(404).send("Not Found");
        }

        apihelper.startWithGettingSkillsTemplate(getAccessTokenObj(),req.body, res);
      }
    );
  }
  else
  {
    api.addNewTemplate(getAccessToken(), req.body, 
      function(error, response, body)
      {
        if (error)
        {
          console.log(error)
          res.status(404).send("Not Found");
        }

        apihelper.startWithAddingSkillsTemplate(getAccessTokenObj(), req.body, res);
      }
    );
  }
});

function getFields(input, callback)
{
  api.getSkills(getAccessToken(), function(error, response, body){
    parser.parseSkills(error, response, body, 
      function(one, two){
        api.getDisclaimers(getAccessToken(), function (error, response, body){
          parser.parseDisclaimers(error, response, body, 
            function(disclaimers){
              input.skillGroupsOne = one;
              input.skillGroupsTwo = two;
              input.disclaimers = disclaimers;
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
      res.render('task-create', result);
    });
  }
  else if (req.query.type == 'task')
  {
   api.getTaskByID(getAccessToken(), req.query.id,
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
        res.render('task-create', result);
      });
    });
 }
 else
 {
  api.getTemplateByID(getAccessToken(), req.query.id,
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
        res.render('task-create', result);
      });
    });
}

});

app.get('/templates/edit', function(req, res) {
  var templateID = req.query.id;
  
  api.getTemplateByID(getAccessToken(), templateID, 
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send('Not Found');
      }

      console.log()
      var template = parser.parseOneTemplate(body);

      getFields(template, function(result){
        result.pageTitle = "Haven - Edit Template";
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

app.get('/tasks/edit', function(req, res) {
  var taskID = req.query.id;

  api.getTaskByID(getAccessToken(), taskID, 
    function(error, response, body){
      if (error)
      {
        console.log(error);
        res.status(404).send('Not Found');
      }

      var task = parser.parseOneTask(body);
      api.getTaskVolunteers(getAccessToken(), taskID, 
        function(error, response, body)
        {
          body = JSON.parse(body);
          task.volunteers = body.items;
          getFields(task, function(result){
            console.log("RESULT: " + JSON.stringify(result));
            result.taskBtn = true;
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


app.post('/signup', function(req, res){
  var token = crypto.randomBytes(15).toString('hex');

  console.log(req.body.email);
  console.log(req.body);
  mailOptions = {
    from: '"Team Haven" <teamhaven@yahoo.com>',
    to: req.body.email, 
    subject: 'Confirm your email to activate your Haven account',
    text: 'Hello ' + req.body.firstName + ',\n\n Thanks for joining Haven! \n\nEnter the following code on our page to activate your account: \n\n' + token + '\n\n. We hope you are excited to join us as we are to have you. \n\n Cheers, \n Team Haven',
    html: '<div style="font-weight: ' + "'lighter'" + 'font-family: Century Gothic"><img src="https://drive.google.com/file/d/0B9FhdwzD65zyM0xjX2FnWXdhNkk/view?usp=sharing" style="width: 15rem"/> <h2> Hello ' + req.body.firstName + ',<br><br></h2> <h3>Thanks for joining Haven! Enter the following code on our page to activate your account:<br><br><b><span style="text-align=' + "'center'; " + 'color: #33cccc">' + token + '</span></b><br><br>We hope you are excited to join us as we are to have you. <br> <br>Cheers, </h3><h2 style="color:"' +'"#33cccc">Team Haven </h2></div>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(info);
    console.log("Message %s sent: %s", info.messageId, info.response);
  });


  res.sendFile(__dirname + '/CreateAccountConfirmation.html');
});

app.get('/imgs/*', function(req, res)
{
  res.sendFile(__dirname + req.url);
});

app.get('*/scripts/*', function(req, res)
{
  res.sendFile(__dirname + req.url);
});


app.get('/tasks/all', function(req, res) {
  api.getAllTasks(getAccessToken(),
    function(error, response, body)
    {
      body = JSON.parse(body);
      console.log(body.items);
      res.json(body.items);
    }
    );
});

app.get('/templates/all', function(req, res){
  api.getAllTemplates(getAccessToken(),
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }
      body = JSON.parse(body);
      res.json(body.items);
    }
    );
});

app.get('/tasks/skills', function(req, res){
  var id = req.query.id;

  api.getTaskSkills(getAccessToken(), id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }

      body = JSON.parse(body);
      console.log(body.items);
      res.json(body.items);
    }
    );
});

app.get('/tasks/disclaimers', function(req, res){
  var id = req.query.id;

  api.getTaskDisclaimers(getAccessToken(), id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }
      body = JSON.parse(body);
      console.log(body.items);
      res.json(body.items);
    }
    );
});


app.get('/templates/skills', function(req, res){
  var id = req.query.id;

  console.log(id);
  api.getTemplateSkills(getAccessToken(), id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }

      body = JSON.parse(body);
      console.log(body.items);
      res.json(body.items);
    }
    );
});

app.get('/templates/disclaimers', function(req, res){
  var id = req.query.id;
  console.log('ID: ' + id);
  api.getTemplateDisclaimers(getAccessToken(), id,
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }
      body = JSON.parse(body);
      console.log(body.items);
      res.json(body.items);
    }
    );
});

app.get('/users/all', function(req, res){
  api.getUsers(getAccessToken(),
    function(error, response, body)
    {
      if (error)
      {
        console.log(error);
      }
      body = JSON.parse(body);
      console.log(body.items);
      res.json(body.items);
    }
    );
});

http.listen(process.env.PORT || 5000, function() {
  console.log('listening on ' + process.env.PORT || 5000);
});


