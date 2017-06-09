var table;

$(document).ready(function(){
	table = $("#volunteers").DataTable({
		'columnDefs': [
			{
				"targets": 6,
				"orderable": false
			},
			{
				"targets": "_all",
				"className": "dt-center"
			}
		],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
	});
});

$(document).on('click', '.edit-button', function(e){
	e.preventDefault();
	var data = table.row($(this).parents('tr')).data();
	var hours = data[5];
	var row = $(this).parents('tr');
	data[5] = '<input type="number" style="text-align: center; color: #33cccc; background-color: white; border-color: #33cccc; width: 80%" min=0 name="hours" value="' + hours + '" class="form-control" id="hours">';
	table.row($(this).parents('tr')).data(data).draw();
	table.row($(this).parents())
	$(row).find('.edit-button').hide();
	$(row).find('.save-button').show();
});

$(document).on('click', '#return-task', function(e){
	e.preventDefault();
	var id = $('#taskID').text();
	var params = $.param({
    	id: id
  	});
	window.location.href = '/tasks/view?' + params;
});

$(document).on('click', '.save-button', function(e){
	e.preventDefault();
	var title = $('#title').text();
	var row = 	$(this).parents('tr');
	var rowData = table.row($(row)).data();
	var name = rowData[1] + " " + rowData[2];
	var hours = $(row).find('#hours').val();
	var volID = rowData[0];
	var taskID = $('#taskID').text();

	rowData[5] = hours;

	var params = $.param({
    	hours: parseInt(hours),
    	volID: parseInt(volID),
    	taskID: parseInt(taskID)
  	});



	$.ajax({
		type: "POST",
		url: "/tasks/hours?" + params,
		success: function (res){
			$(row).find('.save-button').hide();
			$(row).find('.edit-button').show();
			table.row(row).data(rowData).draw();
			alert("Successfully logged " + name + "'s " + hours + " hours working on " + title + ".");
		}
	});	
});