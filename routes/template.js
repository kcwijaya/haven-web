var api = require(__dirname + "/../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var parser = require(__dirname + "/../helpers/parser.js");
var apihelper = require(__dirname + "/../helpers/apihelper.js");
var path = require('path');

router.get('/templates', function(req, res){
  res.sendFile(path.join(__dirname, '/../views/BrowseTemplates.html'));
});

router.post('/save-template', function(req, res){

  var template = parser.populateTemplate(req.body);
  var user = parser.getUser(req);
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

router.post('/save-new-template', function(req, res){
  var template = parser.populateTemplate(req.body);
  template.start_time = parser.formatDate(new Date(Date.now()));
  console.log(req.session.passport.user);
  var user = parser.getUser(req);
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


router.get('/templates/view', function(req, res){
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

router.get('/templates/edit', function(req, res) {
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
      parser.getFields(template, function(result){
        result.pageTitle = "Haven - Edit Template";
        console.log(result);
        res.render('template-edit', result);
      });

    }
    );
});

router.get('/templates/new', function(req, res){
 parser.getFields({}, function(result){
  result.pageTitle = "Haven - Create Template";
  res.render('template-edit', result);
});

});

module.exports = router;
