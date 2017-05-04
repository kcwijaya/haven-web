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
      slidesToScroll: 3,
      dots: true
    });
  }
}

function makeCardGroups(hb, slick)
{
  var source = $(hb).html(); 
  var template = Handlebars.compile(source); 

  $('#template-group').append(template(templateContext));
  $('#edit-group').append(template(editContext));

  if (slick)
  {
    $('.templates').slick({
      slidesToShow: 3, 
      slidesToScroll: 3,
      dots: true
    });

    $('.edits').slick({
      slidesToShow: 3, 
      slidesToScroll: 3,
      dots: true
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
      dots: true
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
    cards: [
      {cardTitle: "Evacuation Plan", cardText: "Plan with skills for a general evacuation scenario"},
      {cardTitle: "Resource Station", cardText: "Distribution station for food, water, blankets, etc"},
      {cardTitle: "Medical Attention", cardText: "First aid required only. Needs to know CPR."},
      {cardTitle: "SAR, Outdoors", cardText: "Search and rescue operation, outdoors, dangerous"},
      {cardTitle: "SAR, Indoors", cardText: "Search and rescue operation, indoors, potentially hazardous."},
    ]
  };

  editContext =
  {
    title: "Create From Existing Task",
    searchID: 'edit-search',
    listID: 'edit-list',
    inputID: 'edit-input',
    boxID: 'edit-box',
    cardID: 'edits',
    cards: [
    
      {cardTitle: "Katrina Food Station", cardText: "Distributing food at a resource distribution center after Hurricane Katrina"},
      {cardTitle: "Civilian Evacuation", cardText: "Evacuating citizens in aftermath of bombing in shopping center"},
      {cardTitle: "Driving Resources", cardText: "Driving resources to Habitat for Humanity location in east side of town"},
      {cardTitle: "House Construction", cardText: "Rebuilding the four exterior walls of a home located a few miles north"},
      {cardTitle: "Search & Rescue, Fire", cardText: "Search and rescue operation after forest fire"},
    ]
  };

  //editContext.cards = cards;
  makeCardGroups('#card-group', true);
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

        editContext.cards = cards;
        makeCardGroups('#card-group', true);
      }

    */
    
  });


$(document).on('click', '#template-search', function(){

});

$(document).on('click', '#template-list', function(){
  makeTemplateGroup('#card-list', false);
  $('#templates').DataTable();
});

$(document).on('click', '#edit-list', function(){
  makeEditGroup('#card-list', false);
  $('#edits').DataTable();

});

$(document).on('click', '#template-box', function(){
  makeTemplateGroup('#card-group', true);
});

$(document).on('click', '#edit-box', function(){
  makeEditGroup('#card-group', true);

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

$(document).on('click', '.card', function (){
  var title = $(this).find('.card-title').text();
  var description = $(this).find('.card-text').text();
  var id = $(this).find('.card-id').text();
  var params = $.param({
    id: id, 
    title: title,
    description: description,
    newBtn: true
  });

  window.location.href = '/templates/view?' + params;
});

$(document).on('click', 'tbody tr', function (){
  var id = $(this).closest('table').attr('id');
  var task = $('#' + id).DataTable().row(this).data();
  var params = $.param({
    id: task[0],
    title: task[1], 
    description: task[2],
    newBtn: true
  });
  window.location.href = '/templates/view?' + params;

});
			