var exphbs = require('express-handlebars');


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

module.exports = hbs;