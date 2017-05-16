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
        console.log("MAKING THE CARDS....");
        cards = [];
        for (i = 0; i < res.length; i++)
        {
          cards.push({
            cardID: res[i].id,
            cardTitle: res[i].title,
            cardText: res[i].description
          });
        }

        console.log(cards);
        taskContext.cards = cards;

        console.log(taskContext);
        makeTaskGroup('#card-group', true);
      }
  });
});

  $('#example tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        alert( 'You clicked on '+data[0]+'\'s row' );
  } );


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

$(document).on('click', '#task-list', function(){
  makeTaskGroup('#card-list', false);
  $('#tasks').DataTable();
});


$(document).on('click', '#task-box', function(){
  makeTaskGroup('#card-group', true);
});

      