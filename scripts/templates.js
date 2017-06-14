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
      slidesToShow: 2, 
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
        makeTemplateGroup('#card-list', false);
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
  window.location.href = '/templates/view?' + params;

});

$(document).on('click', '.card', function (){
  var id = $(this).find('.card-id').text();
  var params = $.param({
    id: id
  });

  window.location.href = '/templates/view?' + params;

});

$(document).on('click', '.delete-button', function(){
   e.preventDefault();
  var data = $('#templates').DataTable().row($(this).parents('tr')).data();

  if (confirm("Are you sure you want to delete the template '" + data[1] + "'?")){
    var id = data[0];
    console.log("DELETING " + id);

    $.ajax({
      type: "GET",
      url: "/tasks/delete?id=" + id,
      success: function(res)
      {
        alert("Successfully deleted the template '" + res.title + "'.");
        $('#templates').DataTable().row($(this).parents('tr')).remove().draw();
      } 
    });
  }
});

$(document).on('click', '#template-list', function(){
  makeTemplateGroup('#card-list', false);
  $('#templates').DataTable( 
    {
      dom: '<"top"B<"space"l>f>rt<"bottom"ip>',
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
    }
  );
});


$(document).on('click', '#template-box', function(){
  makeTemplateGroup('#card-group', true);
});

      