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
      slidesToScroll: 3,
      dots: true
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
    cards: [
      {cardTitle: "Katrina Food Station", cardText: "Distributing food at a resource distribution center after Hurricane Katrina"},
      {cardTitle: "Civilian Evacuation", cardText: "Evacuating citizens in aftermath of bombing in shopping center"},
      {cardTitle: "Driving Resources", cardText: "Driving resources to Habitat for Humanity location in east side of town"},
      {cardTitle: "House Construction", cardText: "Rebuilding the four exterior walls of a home located a few miles north"},
      {cardTitle: "Search & Rescue, Fire", cardText: "Search and rescue operation after forest fire"},
    ]
  };

  makeTaskGroup('#card-group', true);

  /*
  $.ajax({
      type: "GET",
      url: "/tasks/all",
      success: function (res){
        console.log(res);
        cards = [];
        for (i = 0; i < res.length; i++)
        {
          cards.push({
            cardID: res[i].id,
            cardTitle: res[i].title,
            cardText: res[i].description
          });
        }

        taskContext.cards = cards;
        makeTaskGroup('#card-group', true);
      }
  });

  */
  
});

  $('#example tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        alert( 'You clicked on '+data[0]+'\'s row' );
  } );


$(document).on('click', '#tasks tbody tr', function (){
  var task = $('#tasks').DataTable().row(this).data();
  var params = $.param({
    id: task[0],
    title: task[1], 
    description: task[2],
    taskBtn: true
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

      