var taskContext = {};

function makeTaskGroup(hb, slick)
{
  var source = $(hb).html(); 
  var template = Handlebars.compile(source); 

  $('#task-group').html("");
  $('#task-group').append(template(taskContext));

  if (slick)
  {
    $('.tasks').slick({
      slidesToShow: 3, 
      slidesToScroll: 1,
      dots: true,
      rows: 3,
      focusOnSelect: true,
      variableWidth: true
    });
  }
}

$(document).ready(function(){
  taskContext =
  {
    title: "Tasks",
    searchID: 'task-search',
    listID: 'task-list',
    inputID: 'task-input',
    boxID: 'task-box',
    cardID: 'tasks',
    template: true,
  };
  
  $.ajax({
      type: "GET",
      url: "/tasks/all",
      success: function (res){
        cards = [];
        for (i = 0; i < res.length; i++)
        {
          cards.push({
            cardID: res[i].id,
            cardTitle: res[i].title,
            cardText: res[i].description,
            cardOrg: res[i].org_name,
            cardTime: (typeof res[i].start_time != 'undefined') ? new Date(res[i].start_time) : 'Not Provided',
            cardLoc: res[i].location
          });
        }

        taskContext.cards = cards;
        makeTaskGroup('#card-group', true);
      }
  });
});

function getTaskSkills(id)
{
  var params = $.param({
    id: parseInt(id),
  });

  $.ajax({
    type: "GET",
    url: "/tasks/skills?" + params,
    success: function (res){
      console.log("SKILLS: " );
      console.log(res);
      if (res.length == 0)
      {
        $("#skills-text").html('<p> There are currently no required skills.');
        return;
      }
      var categories = {};
      for (i = 0; i < res.length; i++)
      {
        if (!(res[i].category in categories))
        {
          categories[res[i].category] = [];
        }
        categories[res[i].category].push(res[i].name);
      }

      var toAppend = "";

      Object.keys(categories).forEach(function(key,index) {
        toAppend += "<b><h7>" + key + "</h7></b>"
        toAppend += "<ul>"
        for (i = 0; i < categories[key].length; i++)
        {
          toAppend += "<li>" + categories[key][i] + "</li>";
        }
        toAppend += "</ul>";
      });

      $('#skills-text').html(toAppend);
    }
  });
}

function getTaskDisclaimers(id)
{
  var params = $.param({
    id: parseInt(id),
  });

  $.ajax({
    type: "GET",
    url: "/tasks/disclaimers?" + params,
    success: function (res){
      console.log("DISCLAIMERS: " );
      console.log(res);

      if (res.length == 0)
      {
        $("#disclaimers-text").html('<p> There are currently no disclaimers');
        return;
      }

      var toAppend = "<ul>";
      for (i = 0; i < res.length; i++)
      {
        toAppend += "<li>" + res[i].disclaimer + "</li>";
      }
      toAppend += "</ul>";

      $('#disclaimers-text').html(toAppend);
    }
  });
}



$(document).on('click', '#tasks tbody tr', function (){
  var task = $('#tasks').DataTable().row(this).data();
  var params = $.param({
    id: task[0],
  });
  window.location.href = '/tasks/view?' + params;
});

$(document).on('click', '.card', function (){
  var title = $(this).find('.card-title').text();
  var description = $(this).find('.card-text').text();
  var id = $(this).find('.card-id').text();
  var params = $.param({
    id: id, 
    title: title,
    description: description,
    taskBtn: true
  });
  window.location.href = '/tasks/view?' + params;
});

$(document).on('click', '.delete-button', function(e){
  e.preventDefault();
  var data = $('#tasks').DataTable().row($(this).parents('tr')).data();

  if (confirm("Are you sure you want to delete the task '" + data[1] + "'?")){
    var id = data[0];
    console.log("DELETING " + id);

    $.ajax({
      type: "GET",
      url: "/tasks/delete?id=" + id,
      success: function(res)
      {
        alert("Successfully deleted the task '" + res.title + "'.");
        $('#tasks').DataTable().row($(this).parents('tr')).remove().draw();
      } 
    });
  }

});


$(document).on('click', '#task-list', function(){
  makeTaskGroup('#card-list', false);
  $('#tasks').DataTable(
      {
        dom: '<"top"B<"space"l>f>rt<"bottom"ip>',        
        buttons: [
            'copy', 'csv', 'excel', 'pdf'
        ],
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
      }
  );


});


$(document).on('click', '#task-box', function(){
  makeTaskGroup('#card-group', true);
});

      