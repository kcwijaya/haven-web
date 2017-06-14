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


$(document).ready(function (){

	var id = $("#id").text().trim();
	
	 getTaskDisclaimers(id);
	 getTaskSkills(id);

	

	$('#edit-template').click(function(e){
		var id = $('#id').text().trim();
		
		var params = $.param({
			id: id
		});
		window.location.href = "/templates/edit?" + params;
	});


	$('#delete-button').click(function(e){
		e.preventDefault();
	  	if (confirm("Are you sure you want to delete the template '" + $('#title').text().trim() + "'?")){
		var id = $("#id").text().trim();
	    console.log("DELETING " + id);

	    $.ajax({
	      type: "GET",
	      url: "/tasks/delete?id=" + id,
	      success: function(res)
	      {
	        alert("Successfully deleted the template '" + res.title + "'.");
	      	window.location.href = "/templates";
	      } 
	    });
	  }
	});
});