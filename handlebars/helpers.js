
$(document).ready(function(){
  Handlebars.registerHelper('each', function(context, options) {
    var ret = "";

    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + options.fn(context[i]);
    }

    return ret;
  });

  Handlebars.registerHelper('listnowrap', function(context, options) {
    var ret = "";
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }
    return ret;
  });

  Handlebars.registerHelper('list', function(context, options) {
    var ret = "<ul>";
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }
    return ret + "</ul>";
  });
});
			