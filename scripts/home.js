$(document).ready(function (){
	$('#create-account').click(function (e){
		var name = $("#name").val();
		var website = $('#website').val();
		var desc = $('#description').val();

		if (name == '' || typeof name == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();
			$('#name-req').show();
			$('#name-container').addClass('has-danger');
		}
		else
		{
			$('#name-req').hide();
			$('#name-container').removeClass('has-danger');

		}


		if (website == '' || typeof website == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();
			$('#website-req').show();
			$('#website-container').addClass('has-danger');

		}
		else
		{
			$('#website-req').hide();
			$('#website-container').removeClass('has-danger');
		}


		if (desc == '' || typeof desc == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();

			$('#desc-req').show();
			$('#desc-container').addClass('has-danger');
		}
		else
		{
			$('#desc-req').hide();
			$('#desc-container').removeClass('has-danger');
		}
	});

	
	refreshSelect();

	$('#create-org').click(function(e){
		var name = $('#name').val();
		var web = $('#website').val();
		var desc = $('#description').val();

		var org = {
			name: name,
			website: web,
			description: desc
		}

		console.log(org);

		$.ajax({
			type: "POST",
			url: "/orgs", 
			data: org, 
			success: function(res)
			{
				console.log("GOT HERE THOUGH");
				console.log(res);
				alert("Organization " + org.name + " has been created.");
				refreshSelect();
			}
		});
	});
});


$(document).one('click', '#sign-up', function(e){
	e.preventDefault();
	var org = $("#org-select option:selected" ).val();
	console.log(org);

	var params = $.param({
		org: org
	});

	window.location.href = '/signup?' + params;
});

function refreshSelect()
{
	$.ajax({
      type: "GET",
      url: "/orgs",
      success: function(res)
      {
      	var select = document.getElementById('org-select');
      	$(select).html("");
        console.log(res);
        for(i = 0; i < res.length; i ++)
		{
			var org = res[i];
		   var opt = document.createElement("option");
		   opt.value= org.id;
		   opt.innerHTML = org.name; // whatever property it has

		   // then append it to the select element
		   select.appendChild(opt);
		}

      } 
    });
}