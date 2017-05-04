var formSource;
var task;
var map;
var markers;
var volunteerTable;
function makeMap(lat, long)
{
	map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: lat, lng: long},
          zoom: 5
     	});

     	var input = document.getElementById('location');
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

 	var lat = 0;
 	var long = 0;

 	var input = document.getElementById('location');
 	var val = input.value;

 	if (val != null && typeof val != 'undefined' && val != '')
 	{
 		var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': val}, function(results, status) {
          if (status === 'OK' && results.length > 0) {
          	makeMap(results[0].location.geometry.lat(), results[0].location.geometry.lng());
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
 	}
 	else
 	{
 		/*
		navigator.geolocation.getCurrentPosition(function(pos){
			lat = pos.coords.latitude;
			long = pos.coords.longitude
			console.log(lat);
			console.log(long);

			makeMap(lat, long);
		});
		*/
		makeMap(37.429987,  -122.173330);
	}
}

function updateMap()
{
	var reviewMap = new google.maps.Map(document.getElementById('location-map'), {
          center: {lat: task.location.lat, lng: task.location.long},
          zoom: 5,
          disableDefaultUI: true,
          draggable: false, 
          zoomControl: false, 
     });

	placeMarker({lat: task.location.lat, lng: task.location.long}, reviewMap);

	$("#location-words").text(task.location.address);
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

	$("#container").html(formSource);

	 $('#clock').datetimepicker(
	 {
	 	sideBySide: true
	 });


	$("#title").val(task.title);
	$("#location").val(task.location.address);

	makeMap(task.location.lat, task.location.long);

	$("#description").val(task.description);
	$("#instructions").val(task.instructions);
	$("#severity").val(task.severity);
	$("#time").val(task.time);
	$("#clock").data("DateTimePicker").date(task.clock);


	for (i = 0; i < task.disclaimers.length; i++)
	{
		$("input[type=checkbox][value='" + task.disclaimers[i].name + "']").prop("checked",true);
	}

	for (i = 0; i < task.skills.length; i++)
	{
		var skillSet = task.skills[i].skills;
		for (j = 0; j < skillSet.length; j++)
		{
		$("input[type=checkbox][value='" + skillSet[j].name + "']").prop("checked",true);
	
		var moreInfo = $("input[type=checkbox][value='" + skillSet[j].name + "']").parent().find('input[type=text]');
		if (typeof skillSet[j].extra != 'undefined' && skillSet[j].extra != null)
		{
			moreInfo.val(skillSet[j].extra);
		}
	}
	}
}

$(document).ready(function(){
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
		volunteerTable = $('#volunteers').DataTable();
	}

  $("input[type=checkbox]").change(function () {
  	$(this).parent().find('input[type=text]').attr('readonly', !this.checked);
  })



});


$(document).on('click', '#edit-task', function(e){
		e.preventDefault();
		makeForm();
	});

$(document).on('change', "input[type=checkbox]", function () {
  		$(this).parent().find('input[type=text]').attr('readonly', !this.checked);
});

$(document).on('click', '#save-review', function(e){
	formSource = $('#container').html();
	e.preventDefault();
	var title = $("#title").val();
	var address = $("#location").val();

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

	var location = {}
	if (markers.length == 0)
	{
		 var geocoder = new google.maps.Geocoder();
		 geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK' && results.length > 0) {
          	location = {address: address, lat: results[0].geometry.location.lat(), long: results[0].geometry.location.lng()};
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
	}
	else 
	{
		location = {address: address, lat: markers[0].position.lat(), long: markers[0].position.lng() }
	}


	if (title == null || title == "" || location == null || location == "")
	{
		return;
	}
	var description = $("#description").val();
	var instructions = $("#instructions").val();
	var severity = $("#severity option:selected" ).text();
	var time = $("#time option:selected").text();
	var clock = $("#clock").data("DateTimePicker").date();

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
		disclaimer = {};
		disclaimer.name = $(this).attr('value');
		disc.push(disclaimer);
	});

	var skills = [];
	$('.skill-column div').each(function () {
		var skillGroup = {};
		skillGroup.groupName = $(this).attr('id');
		skillGroup.skills = []
		$(this).find('input:checked').each(function (){
			var skill = {};
			skill.name = $(this).attr('value');
			var moreInfo = $(this).parent().find('input[type=text]');
			if (typeof moreInfo != 'undefined')
			{
				console.log(skill.name);
				skill.extra = moreInfo.val();
				console.log(skill.extra);
			}
			skillGroup.skills.push(skill);
		})
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
			volunteerO.push({first: volunteer[0], last: volunteer[1], phone: volunteer[2], email: volunteer[3]});
		}
	}

	task = {
		title: title,
		location: location,
		description: description,
		instructions: instructions,
		severity: severity,
		time: time,
		clock: clock,
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
		url: "/review",
		data: task,
		success: function (res){
			console.log(res);
			$('#container').html(res);

			updateMap();
		}
	});

});

$(document).on('click', '.delete-button', function(e){
	volunteerTable.row($(this).parents('tr')).remove().draw();
});

$(document).on('click', '#add-volunteer', function(e){
	e.preventDefault();
	var first = $("#first").val();
	var last = $("#last").val();
	var phone = $("#phone" ).val();
	var email = $("#email").val();

	var add = volunteerTable.row.add([first, last, phone, email, '<center><i style="font-size: 25px" class="delete-button fa fa-trash"></i></center>']).draw().node();
	$(add).css('background-color', 'white');
	var cells = $(add).find("td");
	cells.each(function(){
		$(this).css('border', '1px solid #dddddd');
	});
});

$(document).on('click', '#save-changes', function(e){
	e.preventDefault();
	$.ajax({
		type: "POST",
		url: "/save-changes", 
		data: task, 
		success: function (res){
			console.log(res);
		}
	});
});

$(document).on('click', '#save-template', function(e){
	e.preventDefault();
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

$(document).on('click', '#post-task', function(e){
	console.log(task);
	$.ajax({
		type: "POST",
		url: "/save-task", 
		data: task, 
		success: function (res){
			console.log(res);
			window.location.href = '/tasks';
		}
	});
});

