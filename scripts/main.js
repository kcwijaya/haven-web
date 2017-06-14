var templateContext = {};
var editContext = {};

function makeTemplateGroup(hb, slick)
{
  var source = $(hb).html(); 
  var template = Handlebars.compile(source); 


  $('#template-group').html("");

  $('#template-group').append(template(templateContext));

  if (slick)
  {
    $('.templates').slick({
      slidesToShow: 3, 
      slidesToScroll: 1,
      dots: true,
      rows: 2,
      focusOnSelect: true,
      variableWidth: true
    });
  }
}

function makeCardGroups(task_hb, temp_hb, slick)
{
  var task_source = $(task_hb).html(); 
  var temp_source = $(temp_hb).html();
  var task_template = Handlebars.compile(task_source);
  var temp_template = Handlebars.compile(temp_source); 

  $('#template-group').append(temp_template(templateContext));
  $('#edit-group').append(task_template(editContext));

  var editToShow = Math.floor(editContext.cards.length/3)+1;
  if (slick)
  {
    $('.templates').slick({
      slidesToShow: 3, 
      slidesToScroll: 1,
      dots: true,
      rows: 2,
      focusOnSelect: true,
      variableWidth: true
    });

    $('.edits').slick({
      slidesToShow: 3, 
      slidesToScroll: 1,
      dots: true,
      rows: 2, 
      focusOnSelect: true,
      variableWidth: true
    });
  }
}

function makeEditGroup(hb, slick)
{
  var source = $(hb).html(); 
  var template = Handlebars.compile(source); 


  $('#edit-group').html("");

  $('#edit-group').append(template(editContext));


  if (slick)
  {
    $('.edits').slick({
      slidesToShow: 3, 
      slidesToScroll: 3,
      dots: true,
      rows: 2,
      focusOnSelect: true,
      variableWidth: true
    });
  }
}

$(document).ready(function(){
  $('#createNewTask').on('click', function(e) {
    var params = $.param({
    newBtn: true
  });

  	window.location.href='/create/new?' + params;
  });



  templateContext =
  {
    title: "Create From Template",
    searchID: 'template-search',
    listID: 'template-list',
    inputID: 'template-input',
    boxID: 'template-box',
    cardID: 'templates',
    template: true,
  };

  editContext =
  {
    title: "Create From Existing Task",
    searchID: 'edit-search',
    listID: 'edit-list',
    inputID: 'edit-input',
    boxID: 'edit-box',
    cardID: 'edits'
  };

   $.ajax({
      type: "GET",
      url: "/tasks/all",
      success: function (res){
        editCards = [];
        orgs = [];
        for (i = 0; i < res.length; i++)
        {
          editCards.push({
            cardID: res[i].id,
            cardTitle: res[i].title,
            cardText: res[i].description,
            cardOrg: res[i].org_name,
            cardTime: (typeof res[i].start_time != 'undefined') ? new Date(res[i].start_time) : 'Not Provided',
            cardLoc: res[i].location
          });
        }

        editContext.cards = editCards;
        $.ajax({
          type: "GET",
          url: "/templates/all",
          success: function (res){
            templateCards = [];
            for (i = 0; i < res.length; i++)
            {
              templateCards.push({
                cardID: res[i].id,
                cardTitle: res[i].title,
                cardText: res[i].description
              });
            }

            templateContext.cards = templateCards;
            makeCardGroups('#task-card-list', '#temp-card-list', false);
          
                  $('#edits').DataTable(
    {
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
    }
  );

        $('#templates').DataTable(
    {
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
    }
  );
          }
      });
      }
    });
});


$(document).on('click', '#template-search', function(){

});

$(document).on('click', '#template-list', function(){
  makeTemplateGroup('#temp-card-list', false);
  $('#templates').DataTable(
    {
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
    }
  );
});

$(document).on('click', '#edit-list', function(){
  makeEditGroup('#task-card-list', false);
  $('#edits').DataTable(
    {
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
    }
  );

});

$(document).on('click', '#template-box', function(){
  makeTemplateGroup('#temp-card-group', true);
});

$(document).on('click', '#edit-box', function(){
  makeEditGroup('#task-card-group', true);

});

$(document).on('click', '#edit-search', function(){
  if ($('#edit-input').is(":visible"))
  {
      $('#edit-input').hide();
  }
  else 
  {
    $('#exist-input').show();
  }
});

$(document).on('click', '.templates .card', function (){
  var title = $(this).find('.card-title').text();
  var description = $(this).find('.card-text').text();
  var id = $(this).find('.card-id').text();
  var params = $.param({
    id: id, 
    type: 'template'
  });

  window.location.href = '/create/new?' + params;
});



$(document).on('click', '#templates tbody tr', function (){
  var id = $(this).closest('table').attr('id');
  var task = $('#' + id).DataTable().row(this).data();
  var params = $.param({
    id: task[0],
    type: 'template'
  });
  window.location.href = '/create/new?' + params;

});

$(document).on('click', '.edits .card', function (){
  var title = $(this).find('.card-title').text();
  var description = $(this).find('.card-text').text();
  var id = $(this).find('.card-id').text();
  var params = $.param({
    id: id, 
    type: 'task'
  });

  window.location.href = '/create/new?' + params;
});



$(document).on('click', '#edits tbody tr', function (){
  var id = $(this).closest('table').attr('id');
  var task = $('#' + id).DataTable().row(this).data();
  var params = $.param({
    id: task[0],
    type: 'task'
  });
  window.location.href = '/create/new?' + params;

});
			