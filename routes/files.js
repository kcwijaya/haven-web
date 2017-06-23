var api = require(__dirname + "/../helpers/oracle-api.js");
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/handlebars/*', function(req, res){
  res.sendFile(path.join(__dirname, '../' + req.url));
});

router.get('/bower_components/*', function(req, res){
  res.sendFile(path.join(__dirname, '../' + req.url));
});

router.get('/stylesheets/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../' + req.url));
});

router.get('/favicons/*', function(req, res){
  res.sendFile(path.join(__dirname, '../' + req.url));
});

router.get('/views/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../' + req.url));
})

router.get('/imgs/*', function(req, res)
{
  res.sendFile(path.join(__dirname, '../' + req.url));
});

router.get('*/scripts/*', function(req, res)
{
  res.sendFile(path.join(__dirname, '../' + req.url));
});


module.exports = router;