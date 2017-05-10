var templateContext = {};

function makeTemplateGroup(hb, slick)
{
  var source = $(hb).html(); 
  var template = Handlebars.compile(source); 


  $('#template-group').html("");

  $('#template-group').append(template(templateContext));

  var numRows = templateContext.cards.length/5;
  if (slick)
  {
    $('.templates').slick({
      slidesToShow: 3, 
      slidesToScroll: 3,
      dots: true,
      rows: numRows,
      focusOnSelect: true,
      variableWidth: true
    });
  }
}


$(document).ready(function(){
  templateContext =
  {
    title: "Templates",
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
{cardTitle: "Evacuation Plan", cardText: "Plan with skills for a general evacuation scenario"},
      {cardTitle: "Resource Station", cardText: "Distribution station for food, water, blankets, etc"},
      {cardTitle: "Medical Attention", cardText: "First aid required only. Needs to know CPR."},
      {cardTitle: "SAR, Outdoors", cardText: "Search and rescue operation, outdoors, dangerous"},
      {cardTitle: "SAR, Indoors", cardText: "Search and rescue operation, indoors, potentially hazardous."},
    ]
  };

  makeTemplateGroup('#card-group', true);
  

});

$(document).on('click', '#templates tbody tr', function (){
  var task = $('#templates').DataTable().row(this).data();
  var params = $.param({
    title: task[0], 
    description: task[1],
    templateBtn: true
  });
  window.location.href = '/templates/view?' + params;
  /*
  $.ajax({
      type: "GET",
      url: "/tasks/view",
      data: task,
      success: function (res){
        console.log(res);
        
      }
    });
    */
});

$(document).on('click', '.card', function (){
  var title = $(this).find('.card-title').text();
  var text = $(this).find('.card-text').text();
  var params = $.param({
    title: title,
    description: text,
    templateBtn: true
  });
  window.location.href = '/templates/view?' + params;
  /*
  $.ajax({
      type: "GET",
      url: "/tasks/view",
      data: task,
      success: function (res){
        console.log(res);
        
      }
    });
    */
});

$(document).on('click', '#template-list', function(){
  makeTemplateGroup('#card-list', false);
  $('#templates').DataTable();
});


$(document).on('click', '#template-box', function(){
  makeTemplateGroup('#card-group', true);
});

      