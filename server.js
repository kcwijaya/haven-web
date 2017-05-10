var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var fs = require('fs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var exphbs = require('express-handlebars');
var url = require('url');
var querystring = require('querystring');
global.XMLHttpRequest = require("xhr2").XMLHttpRequest;
var mcs = require(__dirname + '/scripts/external/mcs.js')
var mcs_config = require(__dirname + '/scripts/external/oracle_mobile_cloud_config.js')
var request = require('request');


function setupMCS()
{
  mcs.mobileBackendManager.platform = new mcs.BrowserPlatform();
  mcs.mobileBackendManager.setConfig(mcs_config);
  this.backend = mcs.mobileBackendManager.getMobileBackend("Haven_Backend");
  if (this.backend != null)
  {
    this.backend.setAuthenticationType("basicAuth");
  }
}

function login(user, pass) {
  function failure(response, data) {
      console.warn(response);
  }
 
  function success(response, data) {
      console.warn("successful login");
  }
 
  backend.Authorization.authenticateAnonymous(success, failure);
}

setupMCS();
login();

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

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/Homepage.html');
});

app.get('/home', function(req, res) {
    res.sendFile(__dirname + '/Homepage.html');
});

app.post('/review', function(req, res) {
  req.body.pageTitle = "Haven - Review Task";
  req.body.layout = false;
  console.log("###VOLUNTEERS####");
  console.log(req.body.volunteers);
  return res.render('review', req.body);
})

app.get('/slick/*', function(req, res){
	res.sendFile(__dirname + req.url);
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
  req.query.pageTitle = 'Haven - ' + req.query.title
  req.query.volunteers = [
    {first: "Kimberly", last: "Wijaya", phone: "(650) 490-0437", email: "kcwijaya@stanford.edu"}, 
    {first: "Maria", last: "Gutierrez", phone: "(650) 922-9534", email: "mariagtz@stanford.edu"}, 
    {first: "Belinda", last: "Esqueda", phone: "(714) 309-3607", email: "besqueda@stanford.edu"}, 
    {first: "Ameeqa", last: "Ali", phone: "(650) 924-5110", email: "ameeqa@stanford.edu"}, 
    {first: "Virgilio", last: "Urmenata", phone: "(650) 796-3148", email: "vurmenet@stanford.edu"}, 
    {first: "Sofi", last: "Arimany", phone: "(786) 338-8496", email: "asarimany@stanford.edu"}, 
  ];
  res.render('task-details', req.query);
});



app.get('/hello', function(req, res){
  res.sendFile(__dirname + '/hello.html');
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

app.get('/templates/view', function(req, res){
  var query = querystring.stringify(req.query);
  res.redirect('/create/new?' + query);
});


app.get('/tasks', function(req, res){
  res.sendFile(__dirname + '/BrowseTasks.html');
});



app.get('/tasks/all', function(req, res){
  console.log(req);
  this.backend.CustomCode.invokeCustomCodeJSONRequest('HavenAPI2/task', "GET", null, 
    function(statusCode, data){
      res.status(statusCode);
      res.send(data);
    },
    function(statusCode, data)
    {
      res.status(statusCode);
      res.send(data);
    });
});

app.post('/save-task', function(req, res){
  res.status(200);
  res.json(req.body);
});

app.post('/save-changes', function(req, res){
  res.status(200);
  res.json(req.body);
});

app.post('/save-template', function(req, res){
  res.status(200);
  res.json(req.body);
});

function getCreateForm(input)
{
  input.skillGroupsOne= [
      { groupName: "Office Support",
        skills: [
        {name: "skill-33", value: "Clerical (filing, etc)"},
        {name: "skill-34", value: "Data Entry", label: "Data Entry, Software", more: "true",moreID: "data-entry-software"},
        {name: "skill-35", value: "Phone Receptionist"},
        ]
      },
      { groupName: "Services",
        skills: [
        {name: "skill-36", value: "Food"},
        {name: "skill-37", value: "Elderly and Disabled Assistance", label: "Elderly/Disabled Assistance"},
        {name: "skill-38", value: "Child Care"},
        {name: "skill-39", value: "Spiritual Counseling"},
        {name: "skill-40", value: "Social Work"},
        {name: "skill-41", value: "Search and Rescue"},
        {name: "skill-42", value: "Auto Repair and Towing", label: "Auto Repair/Towing"},
        {name: "skill-43", value: "Traffic Control"},
        {name: "skill-44", value: "Crime Watch"},
        {name: "skill-45", value: "Animal Rescue"},
        {name: "skill-46", value: "Animal Care"},
        {name: "skill-47", value: "Runner"},
        {name: "skill-48", value: "Disability Service", more: "true", moreID: "disability-service-type"},
        ]
      },
      { groupName: "Structural",
        skills: [
          {name: "skill-49", value: "Damage Assessment"},
          {name: "skill-50", value: "Metal Construction"},
          {name: "skill-51", value: "Wood Construction"},
          {name: "skill-52", value: "Block Construction"},
          {name: "skill-53", value: "Plumbing Construction"},
          {name: "skill-54", value: "Electrical Construction"},
          {name: "skill-55", value: "Roofing Construction"},
        ]
      },
      { groupName: "Transportation",
        skills: [
        {name: "skill-56", value: "Car"},
        {name: "skill-57", value: "Wagon and Minivan", label: "Wagon/Minivan"},
        {name: "skill-58", value: "MaxiVan", label: "Maxi-van, Capacity", more: "true", moreID: "maxivan-capacity"},
        {name: "skill-59", value: "ATV"},
        {name: "skill-60", value: "Off-Road Vehicle or 4WD", label: "Off-Road Vehicle/4WD"},
        {name: "skill-61", value: "Truck", label: "Truck, Description", more: "true", moreID: "truck-details"},
        {name: "skill-62", value: "Boat", label: "Boat, Capacity, Type", more: "true", moreID: "boat-details"},
        {name: "skill-63", value: "Commercial", label: "Commerical, Class", more: "true", moreID: "commerical-details"},
        {name: "skill-64", value: "Camper and RV", label: "Camper/RV, Capacity", more: "true", moreID: "camper-details"},
        {name: "skill-65", value: "Wheelchair Transport"},

        ]
      }
    ];

    input.disclaimers= [
      {name: "disclaimer-1", value: "No Sanitation", label: "No Sanitation"},
      {name: "disclaimer-2", value: "Indoor Location", label: "Indoor Location"},
      {name: "disclaimer-3", value: "Outdoor Location", label: "Outdoor Location"},
      {name: "disclaimer-4", value: "No Food", label: "No Food"},
      {name: "disclaimer-5", value: "Potentially Hazardous Environment", label: "Potentially Hazardous Environment"},
      {name: "disclaimer-6", value: "Protective Gear Required", label:"Protective Gear Required"},
      {name: "disclaimer-7", value: "Day Event", label: "Day Event"},
      {name: "disclaimer-8", value: "High Heat", label: "High Heat"},
      {name: "disclaimer-9", value: "Night Event", label:  "Night Event"},
      {name: "disclaimer-10", value: "No Bathroom", label: "No Sanitation"},
      {name: "disclaimer-11", value: "Day Event", label:"Day Event"},
      {name: "disclaimer-12", value: "No Water", label: "No Water"}
    ];

    input.skillGroupsTwo= [
      { groupName: "Medical",
        skills: [
        {name: "skill-1", value: "Doctor Speciality", more: "true", moreID: "doctor-speciality-text"},
        {name: "skill-2", value: "Nurse Speciality", more: "true", moreID: "nurse-speciality-text"},
        {name: "skill-3", value: "Emergency Medical Certification"},
        {name: "skill-4", value: "Veterinarian"},
        {name: "skill-5", value: "Veterinarian Technician",},
        ]
      },
      { groupName: "Communications",
        skills: [
        {name: "skill-6", value: "CB or Ham Operator"},
        {name: "skill-7", value: "Hotline Operator"},
        {name: "skill-8", value: "Own a Cellphone"},
        {name: "skill-9", value: "Own a Skyphone"},
        {name: "skill-10", value: "Public Relations"},
        {name: "skill-11", value: "Web Page Design"},
        {name: "skill-12", value: "Public Speaker"},
        ]
      },
      { groupName: "Languages",
        skills: [
          {name: "skill-13", value: "English"},
          {name: "skill-14", value: "French"},
          {name: "skill-15", value: "German"},
          {name: "skill-16", value: "Italian"},
          {name: "skill-17", value: "Spanish"},
          {name: "skill-18", value: "Ukranian"},
          {name: "skill-19", value: "Mandarin"},
          {name: "skill-20", more: "true", moreID: "custom-language-1-text"},
          {name: "skill-21", more: "true", moreID: "custom-language-2-text"},
          {name: "skill-22", more: "true", moreID: "custom-language-3-text"},
          {name: "skill-23", more: "true", moreID: "custom-language-4-text"},
        ]
      },
      { groupName: "Labor",
        skills: [
        {name: "skill-24", value: "Loading and Shipping", label: "Loading/Shipping"},
        {name: "skill-25", value: "Sorting and Packing", label: "Sorting/Packing"},
        {name: "skill-26", value: "Clean-Up"},
        {name: "skill-27", value: "Operate Equipment", label: "Operate Equipment, Types", more: "true", moreID: "operate-equipment-type"},
        {name: "skill-28", value: "Supervising Others"},
        ]
      },
      { groupName: "Equipment",
        skills: [
        {name: "skill-29", value: "Backhoe"},
        {name: "skill-30", value: "Chainsaw"},
        {name: "skill-31", value: "Generator"},
        {name: "skill-32", value: "Other", more:"true", moreID:"other-equipment-type"},

        ]
      }
    ];

    return input;
}

app.get('/create/new', function(req, res) {
  console.log(req.query);

  var id = req.query.id;
  console.log("ID: " + id);

  req.query.pageTitle = 'Haven - Create';
  req.query = getCreateForm(req.query);
  /*
  this.backend.CustomCode.invokeCustomCodeJSONRequest('HavenAPI2/task/' + id, "GET", null, 
    function(statusCode, data){
      res.status(statusCode);
      console.log("DATA " + data);
      data = getCreateForm(data);
      console.log(data);
      data.pageTitle = 'Haven - Create';
      res.render('task-create', data);

    },
    function(statusCode, data)
    {
      res.status(statusCode);
      res.send(data);
    });
  */

  res.render('task-create', req.query);
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



http.listen(process.env.PORT || 5000, function() {
    console.log('listening on ' + process.env.PORT || 5000);
});


