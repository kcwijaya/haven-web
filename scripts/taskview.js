$(document).ready(function (){
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