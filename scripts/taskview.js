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
	$('#edit-task').click(function(e){
		var id = $('#id').text().trim();
		var volunteers = [];
		$("#volunteers tbody tr").each(function(){
			var cells = $(this).find("td");
			var data = [];

			cells.each(function() {
				data.push($(this).text().trim());
			});

			volunteers.push({
				first: data[0], 
				last: data[1], 
				phone: data[2], 
				email: data[3]
			});
		});
		var params = $.param({
			id: id,
			volunteers: volunteers
		});
		window.location.href = "/tasks/edit?" + params;
	});
});