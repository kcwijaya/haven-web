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
      slidesToScroll: 1,
      dots: true,
      rows: 3,
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
    template: true
  };

  $.ajax({
      type: "GET",
      url: '/templates/all',
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

        templateContext.cards = cards;
        makeTemplateGroup('#card-group', true);
      }
  });

  

});

$(document).on('click', '#createNewTemplate', function(){
    window.location.href='/templates/new';
});

$(document).on('click', '#templates tbody tr', function (){
  var task = $('#templates').DataTable().row(this).data();
  var params = $.param({
    id: task[0], 
  });
  window.location.href = '/templates/edit?' + params;

});

$(document).on('click', '.card', function (){
  var id = $(this).find('.card-id').text();
  var params = $.param({
    id: id
  });

  window.location.href = '/templates/edit?' + params;

});

$(document).on('click', '#template-list', function(){
  makeTemplateGroup('#card-list', false);
  $('#templates').DataTable( 
    {
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
    }
  );
});


$(document).on('click', '#template-box', function(){
  makeTemplateGroup('#card-group', true);
});

      