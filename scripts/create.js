var formSource;
var task;
var map;
var markers;
var volunteerTable;
var userTable;
var pressed;

function makeMap(lat, long)
{

	console.log("Lat: " + lat + ", Lng: " + long);
	if (lat != 0 && long != 0)
	{
		map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: lat, lng: long},
          zoom: 5
     	});	
	}
	else
	{
		map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: lat, lng: long},
          zoom: 0
     	});	
	}
	
     	var input = document.getElementById('location');
     	console.log("LOCATION: " + input.value);
        var searchBox = new google.maps.places.SearchBox(input);
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        markers = [];

        placeMarker({lat: lat, lng: long}, map);
        fillSearchBox({lat: lat, lng: long}, map);

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }


            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });

        google.maps.event.addListener(map, 'click', function(event) {
    		placeMarker(event.latLng, map);
    		fillSearchBox(event.latLng, map);
  		});
}

function initMap()
{
	console.log("Init Pressed: " + pressed);
	if (pressed == true)
	{
		pressed = false;
		return;
	}

 	var lat = 0;
 	var long = 0;

 	var input = document.getElementById('location');
 	var val = '';
 	if (input == null)
 	{
 		val = '';
 	}
 	else
 	{
 	    val = input.value;
 	}


 	if (val != null && typeof val != 'undefined' && val != '')
 	{
 		console.log("LOOKING UP: " + val);
 		var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': val}, function(results, status) {
          if (status === 'OK') {
          	console.log(results);
          	makeMap(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
 	}
 	else
 	{
		makeMap(0, 0);
	}
}

function updateMap()
{
	var reviewMap = new google.maps.Map(document.getElementById('location-map'), {
          center: {lat: task.latitude, lng: task.longitude},
          zoom: 5,
          disableDefaultUI: true,
          draggable: false, 
          zoomControl: false, 
     });

	placeMarker({lat: task.latitude, lng: task.longitude}, reviewMap);

	$("#location-words").text(task.location);
}

function placeMarker(location, currMap){
	markers.forEach(function(marker) {
		marker.setMap(null);
	});

	markers = [];

	var marker = new google.maps.Marker({
		position: location,
		map: currMap,
		draggable: true
	});

	markers.push(marker);	
}


function fillSearchBox(location, currMap)
{
	var input = document.getElementById('location');

	var geocoder = new google.maps.Geocoder;
	geocoder.geocode({'location': location}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              currMap.setZoom(11);
              input.value = results[0].formatted_address;
            } 
         } 

         currMap.setCenter(location);
    });


	
}
function makeForm()
{
	console.log(formSource);

	console.log("Task: ");
	console.log(task);
	$("#container").html(formSource);


	 $('#clock').datetimepicker(
	 {
	 	allowInputToggle: true, 
	 	sideBySide: true
	 });

	$("#status").val(task.status);
	$("#title").val(task.title);
	$("#contact_person").val(task.point_of_contact);
	$("#location").val(task.location);
	$("#backgroundcheck").val(task.backgroundcheck);

	makeMap(task.latitude, task.longitude);

	$("#description").val(task.description);
	$("#instructions").val(task.instructions);
	$("#severity").val(task.severity_id);
	console.log(task.severity_id);
	$("#clock").data("DateTimePicker").date(task.start_time);
	$("#num_volunteers").val(task.num_volunteers);

	console.log(task);
	for (i = 0; i < task.disclaimers.length; i++)
	{
		$("#" + task.disclaimers[i].id).prop("checked",true);
	}

	for (i = 0; i < task.skills.length; i++)
	{
		var skillSet = task.skills[i].skills;
		for (j = 0; j < skillSet.length; j++)
		{
		$("#" + skillSet[j].id).prop("checked",true);
	
		var moreInfo = $("#" + skillSet[j].id).parent().find('input[type=text]');
		if (typeof skillSet[j].extra != 'undefined' && skillSet[j].extra != null)
		{
			moreInfo.val(skillSet[j].extra);
		}
	}
	}
}

function makeTemplateForm()
{
	console.log(formSource);

	$("#container").html(formSource);

	$("#title").val(task.title);

	$("#description").val(task.description);
	$("#instructions").val(task.instructions);
	$("#num_volunteers").val(task.num_volunteers);

	console.log("CURREN TEMPLATE: ");
	console.log(task);
	for (i = 0; i < task.disclaimers.length; i++)
	{
		$("#" + task.disclaimers[i].id).prop("checked",true);
	}

	for (i = 0; i < task.skills.length; i++)
	{
		var skillSet = task.skills[i].skills;
		for (j = 0; j < skillSet.length; j++)
		{
		$("#" + skillSet[j].id).prop("checked",true);
	
		var moreInfo = $("#" + skillSet[j].id).parent().find('input[type=text]');
		if (typeof skillSet[j].extra != 'undefined' && skillSet[j].extra != null)
		{
			moreInfo.val(skillSet[j].extra);
		}
	}
	}
}

function getTemplateSkills(id)
{
  var params = $.param({
    id: parseInt(id),
  });

	$.ajax({
		type: "GET",
		url: "/templates/skills?" + params,
		success: function (res){
			console.log(res);
			for (i = 0; i < res.length; i++)
			{
				$("#" + res[i].id).prop('checked', true);
			}
		}
	});
}

function getTemplateDisclaimers(id)
{
  var params = $.param({
    id: parseInt(id),
  });

	$.ajax({
		type: "GET",
		url: "/templates/disclaimers?" + params,
		success: function (res){
			console.log(res);
			for (i = 0; i < res.length; i++)
			{
				$("#" + res[i].id).prop('checked', true);
			}
		}
	});
}


function checkSkillsDisc(id)
{
  var params = $.param({
    id: parseInt(id),
  });

	$.ajax({
		type: "GET",
		url: "/tasks/id?" + params,
		success: function (res){
			console.log(res);


			for (i = 0; i < res.length; i++)
			{
				$("#" + res[i].id).prop('checked', true);
			}
		}
	});
}

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
			for (i = 0; i < res.length; i++)
			{
				$("#" + res[i].id).prop('checked', true);
			}
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
			for (i = 0; i < res.length; i++)
			{
				$("#" + res[i].id).prop('checked', true);
			}
		}
	});
}

function getUsers(id)
{
	$.ajax({
		type: "GET",
		url: "/users/all",
		success: function(res){
			console.log("USERS: ");
			console.log(res);
			userTable = $("#users").DataTable({
				'data': res,
				'columns': [
					{
						'title': '',
						'data': 'id',
						'visible': false
					},
					{ 
						'title': 'Name',
					 	'data': 'name'
					}, 
					{ 
						'title': 'Email',
						'data': 'email'
					}, 
					{ 
						'title': ''
					}
				],
        		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				'columnDefs': [
					{
						"targets": 3,
						"render": function (data, type, full, meta){
							return '<center><i style="font-size:25px" class="add-volunteer fa fa-plus-square"></i>'
						},
						"orderable": false
					}
				]
			})
		}
	})
}

$(document).ready(function(){
	var taskID = $('#taskID').text();
	var templateID = $('#templateID').text();

	if (typeof taskID != 'undefined' && taskID != '')
	{
		console.log("Populating task details...");
		taskID = parseInt(taskID);
		checkSkillsDisc(taskID);
		getTaskSkills(taskID);
		getTaskDisclaimers(taskID);
		getUsers();
	}
	
	if (typeof templateID != 'undefined' && templateID != '')
	{
		templateID = parseInt(templateID);
		getTemplateSkills(templateID);
		getTemplateDisclaimers(templateID);
	}

	markers = [];
	 $('#clock').datetimepicker(
	 {
	 	sideBySide: true
	 });

	var source = $("#email-template").html(); 
	if (typeof source != "undefined")
	{
		var template = Handlebars.compile(source); 
		$('#email-text').append(template({ email: 'kimberlycwijaya@yahoo.com'}));
	
	}

	if (typeof document.getElementById('volunteers')!= 'undefined')
	{
		if (typeof volunteerTable == 'undefined' || volunteerTable == null)
		{

			volunteerTable = $('#volunteers').DataTable({
				'columnDefs': [
				{
					'targets': 4,
					'orderable': false
				}
				],
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
			});
		}
	}
  

  $("input.more-info").on("keyup blur", function() {
  	    $(this).parent().find('input[type=checkbox]').attr('checked', this.value != "");
   });

  initMap();

});

$(document).one('click', '#edit-task', function(e){
		e.preventDefault();
		makeForm();
 });

$(document).one('click', '#edit-template', function(e){
		e.preventDefault();
		makeTemplateForm();
 });


$(document).on('change', "input[type=checkbox]", function () {
  		$(this).parent().find('input[type=text]').attr('readonly', !this.checked);
});

$(document).one('click', '#save-review-task', function(e){
	formSource = $('#container').html();
	e.preventDefault();
	var id = $("#taskID").text();
	var title = $("#title").val();
	var address = $("#location").val();
	var clock = $("#clock-input").val();
	var backgroundcheck = $("#backgroundcheck").val();

	if (title == '' || typeof title == 'undefined')
	{
		$("#title-req").show();
		$("#title-container").addClass('has-danger');
	}
	else
	{
		$("#title-req").hide();
		$('#title-container').removeClass('has-danger');
	}

	if (address == '' || typeof address == 'undefined')
	{
		$("#loc-req").show();
		$("#loc-container").addClass('has-danger');
	}
	else
	{
		$("#loc-req").hide();
		$('#loc-container').removeClass('has-danger');
	}

	

	if (clock == null || clock=="")
	{
		$('#clock-req').show();
		$('#clock-container').addClass('has-danger');

	}
	else
	{
		$("#clock-req").hide();
		$('#clock-container').removeClass('has-danger');
		clock =	clock.toString();
	}



	if (address == '')
	{
		initMap();
		return;
	}

	var location;
	var latitude;
	var longitude;

	
	var description = $("#description").val();
	var instructions = $("#instructions").val();
	var severity = $("#severity option:selected" ).text();
	var num_volunteers = $("#num_volunteers").val();
	var contact_person = $("#contact_person").val();
	var status = $("#status").val();

	if (num_volunteers != '')
	{
		num_volunteers = parseInt(num_volunteers);
	}

	

	var disc = [];
	$('#disclaimers input:checked').each(function() {
		var disclaimer = {};
		disclaimer.name = $(this).attr('value');
		disclaimer.id = parseInt($(this).attr('name'));
		disc.push(disclaimer);
	});

	var skills = [];
	$('.skill-column div').each(function () {
		var skillGroup = {};
		skillGroup.groupName = $(this).attr('id');
		skillGroup.skills = [];

		$(this).find('input:checked').each(function (){
			var skill = {};
			skill.name = $(this).attr('value');
			skill.id = parseInt($(this).attr('name'));
			var moreInfo = $(this).parent().find('input[type=text]');
			if (typeof moreInfo != 'undefined')
			{
				skill.extra = moreInfo.val();
			}
			if (skill.name != '')
			{
			skillGroup.skills.push(skill);
			}
		});

		if (typeof skillGroup.groupName != 'undefined' && skillGroup.skills.length > 0)
		{
			skills.push(skillGroup);
		}
	});

	var volunteerE = document.getElementById('volunteers');
	var volunteers = []
	var volunteerO = []
	if (volunteerE != null && typeof volunteerE != 'undefined')
	{
		volunteers = volunteerTable.rows().data().toArray();
		for (i = 0; i < volunteers.length; i++)
		{
			volunteer = volunteers[i];
			volunteerO.push({id: parseInt(volunteer[0]), name: volunteer[1], email: volunteer[2]});
		}
	}

	console.log(markers);
	if (markers.length == 0)
	{
		 var geocoder = new google.maps.Geocoder();
		 geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
          	location = address;
          	latitude = results[0].geometry.location.lat();
          	longitude = results[0].geometry.location.lng();

          	if (title == null || title == "" || location == null || location == "")
			{
				return;
			}

			task = {
				title: title,
				location: location,
				latitude: latitude,
				longitude: longitude,
				description: description,
				instructions: instructions,
				severity_id: severity,
				start_time: clock,
				backgroundcheck: backgroundcheck,
				num_volunteers: num_volunteers,
				disclaimers: disc,
				skills: skills,
				newBtn: true,
				id: id,
				point_of_contact: contact_person,
				status: status
			}



			if (volunteerO.length > 0)
			{
				task.volunteers = volunteerO;
			}

			console.log(task);

			$.ajax({
				type: "POST",
				url: "/review-task",
				data: task,
				success: function (res){
					console.log(res);
					pressed = true;
					$('#container').html(res);
					updateMap();
				}
			});

          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
	}
	else 
	{
		console.log(markers);

		location = address;
		latitude = markers[0].position.lat();
		longitude = markers[0].position.lng();

		if (title == null || title == "" || location == null || location == "")
			{
				return;
			}

			task = {
				title: title,
				location: location,
				latitude: latitude,
				longitude: longitude,
				description: description,
				instructions: instructions,
				backgroundcheck: backgroundcheck,
				severity_id: severity,
				start_time: clock,
				num_volunteers: num_volunteers,
				disclaimers: disc,
				status: status,
				point_of_contact: contact_person,
				skills: skills,
				id: id,
				newBtn: true
			}

			if (volunteerO.length > 0)
			{
				task.volunteers = volunteerO;
			}

			console.log(task);

			$.ajax({
				type: "POST",
				url: "/review-task",
				data: task,
				success: function (res){
					pressed = true;
					$('#container').html(res);
					updateMap();
				}
			});
	}
});

$(document).one('click', '#save-review', function(e){
	formSource = $('#container').html();
	e.preventDefault();
	var id = $("#taskID").text();
	var title = $("#title").val();
	var address = $("#location").val();
	var backgroundcheck = $('#backgroundcheck').val();

	if (title == '' || typeof title == 'undefined')
	{
		$("#title-req").show();
		$("#title-container").addClass('has-danger');
	}
	else
	{
		$("#title-req").hide();
		$('#title-container').removeClass('has-danger');
	}

	if (address == '' || typeof address == 'undefined')
	{
		$("#loc-req").show();
		$("#loc-container").addClass('has-danger');
	}
	else
	{
		$("#loc-req").hide();
		$('#loc-container').removeClass('has-danger');
	}


	if (address == '')
	{
		initMap();
		return;
	}

	var location;
	var latitude;
	var longitude;

	
	var description = $("#description").val();
	var instructions = $("#instructions").val();
	var severity = $("#severity option:selected" ).text();
	var clock = $("#clock-input").val();
	var num_volunteers = $("#num_volunteers").val();
	var status = $("#status").val();
	var contact_person = $("#contact_person").val();

	if (num_volunteers != '')
	{
		num_volunteers = parseInt(num_volunteers);
	}

	if (clock == null)
	{
		clock = "";
	}
	else
	{
		clock =	clock.toString();
	}

	var disc = [];
	$('#disclaimers input:checked').each(function() {
		var disclaimer = {};
		disclaimer.name = $(this).attr('value');
		disclaimer.id = parseInt($(this).attr('name'));
		disc.push(disclaimer);
	});

	var skills = [];
	$('.skill-column div').each(function () {
		var skillGroup = {};
		skillGroup.groupName = $(this).attr('id');
		skillGroup.skills = [];

		$(this).find('input:checked').each(function (){
			var skill = {};
			skill.name = $(this).attr('value');
			skill.id = parseInt($(this).attr('name'));
			var moreInfo = $(this).parent().find('input[type=text]');
			if (typeof moreInfo != 'undefined')
			{
				skill.extra = moreInfo.val();
			}
			if (skill.name != '')
			{
			skillGroup.skills.push(skill);
			}
		});

		if (typeof skillGroup.groupName != 'undefined' && skillGroup.skills.length > 0)
		{
			skills.push(skillGroup);
		}
	});

	var volunteerE = document.getElementById('volunteers');
	var volunteers = []
	var volunteerO = []
	if (volunteerE != null && typeof volunteerE != 'undefined')
	{
		volunteers = volunteerTable.rows().data().toArray();
		for (i = 0; i < volunteers.length; i++)
		{
			volunteer = volunteers[i];
			volunteerO.push({id: parseInt(volunteer[0]), first_name: volunteer[1], last_name: volunteer[2], phone_number: volunteer[3], email: volunteer[4]});
		}
	}

	console.log(markers);
	if (markers.length == 0)
	{
		 var geocoder = new google.maps.Geocoder();
		 geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
          	location = address;
          	latitude = results[0].geometry.location.lat();
          	longitude = results[0].geometry.location.lng();

          	if (title == null || title == "" || location == null || location == "")
			{
				return;
			}

			task = {
				title: title,
				location: location,
				latitude: latitude,
				longitude: longitude,
				description: description,
				instructions: instructions,
				backgroundcheck: backgroundcheck,
				severity_id: severity,
				start_time: clock,
				num_volunteers: num_volunteers,
				disclaimers: disc,
				skills: skills,
				newBtn: true,
				status: status, 
				point_of_contact: contact_person
			}

			if (volunteerO.length > 0)
			{
				task.volunteers = volunteerO;
			}

			console.log(task);

			$.ajax({
				type: "POST",
				url: "/review-new",
				data: task,
				success: function (res){
					console.log(res);
					pressed = true;
					$('#container').html(res);
					updateMap();
				}
			});

          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
	}
	else 
	{
		console.log(markers);

		location = address;
		latitude = markers[0].position.lat();
		longitude = markers[0].position.lng();

		if (title == null || title == "" || location == null || location == "")
			{
				return;
			}

			task = {
				title: title,
				location: location,
				latitude: latitude,
				longitude: longitude,
				description: description,
				instructions: instructions,
				severity_id: severity,
				backgroundcheck: backgroundcheck,
				start_time: clock,
				num_volunteers: num_volunteers,
				status: status,
				point_of_contact: contact_person,
				disclaimers: disc,
				skills: skills,
				newBtn: true
			}

			if (volunteerO.length > 0)
			{
				task.volunteers = volunteerO;
			}

			console.log(task);

			$.ajax({
				type: "POST",
				url: "/review-new",
				data: task,
				success: function (res){
					pressed = true;
					$('#container').html(res);
					updateMap();
				}
			});
	}
});

$(document).on('click', '.delete-button', function(e){
	if (confirm("Are you sure you want to delete this volunteer?")){
		volunteerTable.row($(this).parents('tr')).remove().draw();
	}
});

function validatePhone(phone)  
{  
  var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(phone);
}  

function validateEmail(email)  
{  
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}  


$(document).on('click', '.add-volunteer', function(e){
	var vol = userTable.row($(this).parents('tr')).data();
	console.log(vol);

	var currVolunteers = volunteerTable.data();
	console.log(currVolunteers);

	for (i = 0; i < currVolunteers.length; i++)
	{
		if (parseInt(currVolunteers[i][0]) == vol['id'])
		{
			alert(vol['name'] + " is already signed up.");
			return;
		}
	}
	var add = volunteerTable.row.add([vol['id'], vol['name'], vol['email'], 0, '<center><i style="font-size: 25px" class="delete-button fa fa-trash"></i></center>']).draw().node();
	$(add).css('background-color', 'white');
	var cells = $(add).find("td");
	cells.each(function(){
		$(this).css('border', '1px solid #dddddd');
	});

	$(cells[0]).css('display', 'none');
	alert(vol['name'] + " has been added.");

});

$(document).one('click', '#review-template', function(e){
	formSource = $('#container').html();
	e.preventDefault();
	var id = $("#templateID").text();
	var title = $("#title").val();

	if (title == '' || typeof title == 'undefined')
	{
		$("#title-req").show();
		$("#title-container").addClass('has-danger');
	}
	else
	{
		$("#title-req").hide();
		$('#title-container').removeClass('has-danger');
	}
	
	var description = $("#description").val();
	var instructions = $("#instructions").val();
	var num_volunteers = $("#num_volunteers").val();

	if (num_volunteers != '')
	{
		num_volunteers = parseInt(num_volunteers);
	}

	var disc = [];
	$('#disclaimers input:checked').each(function() {
		var disclaimer = {};
		disclaimer.name = $(this).attr('value');
		disclaimer.id = parseInt($(this).attr('name'));
		disc.push(disclaimer);
	});

	var skills = [];
	$('.skill-column div').each(function () {
		var skillGroup = {};
		skillGroup.groupName = $(this).attr('id');
		skillGroup.skills = [];

		$(this).find('input:checked').each(function (){
			var skill = {};
			skill.name = $(this).attr('value');
			skill.id = parseInt($(this).attr('name'));
			var moreInfo = $(this).parent().find('input[type=text]');
			if (typeof moreInfo != 'undefined')
			{
				skill.extra = moreInfo.val();
			}
			if (skill.name != '')
			{
			skillGroup.skills.push(skill);
			}
		});

		if (typeof skillGroup.groupName != 'undefined' && skillGroup.skills.length > 0)
		{
			skills.push(skillGroup);
		}
	});
		
	task = {
		title: title,
		description: description,
		instructions: instructions,
		num_volunteers: num_volunteers,
		disclaimers: disc,
		skills: skills,
	}

	console.log(task);
	if (typeof id != 'undefined' && id != '')
	{
		task.id = parseInt(id);
	}

	$.ajax({
		type: "POST",
		url: "/review-template", 
		data: task, 
		success: function (res){
			$('#container').html(res);
		}
	});
});

function popSkillsAndDisc()
{
	var skills = [];
	if (typeof task.skills != 'undefined')
	{
		for (i = 0; i < task.skills.length; i++)
		{
			var skillGroup = task.skills[i];
			for (j = 0; j < skillGroup.skills.length; j++)
			{
				skills.push(parseInt(skillGroup.skills[j].id));
			}
		}
	}

	task.skills = skills;


	var disclaimers = [];
	if (typeof task.disclaimers != 'undefined')
	{
	for (i = 0; i < task.disclaimers.length; i++)
	{
		disclaimers.push(parseInt(task.disclaimers[i].id));
	}

}
	task.disclaimers = disclaimers;
}

$(document).one('click', '#save-template', function(e){
	e.preventDefault();

	popSkillsAndDisc();

	console.log(task);

	$.ajax({
		type: "POST",
		url: "/save-template", 
		data: task, 
		success: function (res){
			console.log(res);
			window.location.href = '/templates';
		}
	});
});


$(document).one('click', '#save-new-template', function(e){
	e.preventDefault();

	var id = $('#templateID').text();

	if (typeof id != 'undefined' && id != '')
	{
		task.id = parseInt(id);
	}
	popSkillsAndDisc();

	console.log(task);

	$.ajax({
		type: "POST",
		url: "/save-new-template", 
		data: task, 
		success: function (res){
			console.log(res);
			window.location.href = '/templates';
		}
	});
});
$(document).one('click', '#post-task', function(e){
	var skills = [];
	for (i = 0; i < task.skills.length; i++)
	{
		var skillGroup = task.skills[i];
		for (j = 0; j < skillGroup.skills.length; j++)
		{
			skills.push(parseInt(skillGroup.skills[j].id));
		}
	}

	task.skills = skills;

	var disclaimers = [];
	for (i = 0; i < task.disclaimers.length; i++)
	{
		disclaimers.push(parseInt(task.disclaimers[i].id));
	}

	task.disclaimers = disclaimers;

	console.log(task);

	$.ajax({
		type: "POST",
		url: "/post-task", 
		data: task, 
		success: function (res){
			console.log(res);
			window.location.href = '/tasks';
		}
	});
});

$(document).one('click', '#save-task', function(e){
	e.preventDefault();
	var id = $('#taskID').text();

	if (typeof id != 'undefined' && id != '')
	{
		task.id = parseInt(id);
	}

	console.log(task.id);
	var skills = [];
	for (i = 0; i < task.skills.length; i++)
	{
		var skillGroup = task.skills[i];
		for (j = 0; j < skillGroup.skills.length; j++)
		{
			skills.push(parseInt(skillGroup.skills[j].id));
		}
	}

	task.skills = skills;

	var disclaimers = [];
	for (i = 0; i < task.disclaimers.length; i++)
	{
		disclaimers.push(parseInt(task.disclaimers[i].id));
	}

	task.disclaimers = disclaimers;

	console.log(task);

	$.ajax({
		type: "post",
		url: "/save-task", 
		data: task, 
		success: function (res){
			console.log(res);
			window.location.href = '/tasks';
		}
	});
});





