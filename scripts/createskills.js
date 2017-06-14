
$(document).ready(function(){

	refreshSelect();
	$('#create-skill').click(function (e){
		e.preventDefault();

		var name = $("#skill-name").val();
		var category = $("#skill-category option:selected").text();

		if (name == '' || typeof name == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();
			$('#skill-name-req').show();
			$('#skill-name-container').addClass('has-danger');
		}
		else
		{
			$('#skill-name-req').hide();
			$('#skill-name-container').removeClass('has-danger');
		}

		var obj = {
			category: category,
			name: name
		}



		if (confirm("Are you sure you want to create the skill '" + name + "' with category '" + category + "'?")){
			$.ajax({
		      type: "POST",
		      data: obj, 
		      url: "/createSkill",
		      success: function(res)
		      {
		      	alert("Successfully created skill named " + name);

		      	var add = $("#skills").DataTable().row.add([res.id, res.category, res.name]).draw().node();
				var cells = $(add).find("td");
				cells.each(function(){
					$(this).css('border', '1px solid #dddddd');
				});

				$(cells[0]).css('display', 'none');
		      } 
		    });
		}

	});

		$('#create-disclaimer').click(function (e){
		e.preventDefault();

		var name = $("#disclaimer-name").val();

		if (name == '' || typeof name == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();
			$('#disclaimer-name-req').show();
			$('#disclaimer-name-container').addClass('has-danger');
		}
		else
		{
			$('#disclaimer-name-req').hide();
			$('#disclaimer-name-container').removeClass('has-danger');
		}

		var obj = {
			disclaimer: name 
		}

		if (confirm("Are you sure you want to create the disclaimer '" + name + "'?")){
			$.ajax({
		      type: "POST",
		      url: "/createDisclaimer",
		      data: obj, 
		      success: function(res)
		      {
		      	alert("Successfully created disclaimer named " + name);
		      	var add = $("#disclaimers").DataTable().row.add([res.id, res.disclaimer]).draw().node();
				var cells = $(add).find("td");
				cells.each(function(){
					$(this).css('border', '1px solid #dddddd');
				});

				$(cells[0]).css('display', 'none');
		      } 
		    });
		}

	});


  $('#skills').DataTable(
      {
        dom: '<"top"B<"space"l>f>rt<"bottom"ip>',
        buttons: [
            'copy', 'csv', 'excel', 'pdf'
        ],
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
      }
  );

  $('#disclaimers').DataTable(
      {
        dom: '<"top"B<"space"l>f>rt<"bottom"ip>',
        buttons: [
            'copy', 'csv', 'excel', 'pdf'
        ],
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
      }
  );


 function refreshSelect()
{
	$.ajax({
      type: "GET",
      url: "/skillCategories",
      success: function(res)
      {
      	var select = document.getElementById('skill-category');
      	$(select).html("");
        console.log(res);
        for(i = 0; i < res.length; i ++)
		{
		   var opt = document.createElement("option");
		   opt.value= res[i];
		   opt.innerHTML = res[i]; // whatever property it has

		   // then append it to the select element
		   select.appendChild(opt);
		}

		var opt = document.createElement("option");
		opt.value = 'Miscellaneous';
		opt.innerHTML = 'Miscellaneous'
		select.appendChild(opt);

      } 
    });
}

});

      