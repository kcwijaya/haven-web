markers = []

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

function updateMap()
{
	var loc = $("#location-input").text();
	var reviewMap;
	var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': loc}, function(results, status) {
          if (status === 'OK') {
          	console.log(results);
          	center = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
          	reviewMap = new google.maps.Map(document.getElementById('map'), {
				          center: center,
				          zoom: 17,
				          disableDefaultUI: true,
				          draggable: false, 
				          zoomControl: false
     	 });
          		placeMarker({lat: center.lat, lng: center.lng}, reviewMap);

          } else {
          	center = {lat: 0, lng: 0};
          	reviewMap = new google.maps.Map(document.getElementById('map'), {
				          center: center,
				          zoom: 5,
				          disableDefaultUI: true,
				          draggable: false, 
				          zoomControl: false
      }		);
          	placeMarker({lat: 0, lng: 0}, reviewMap);

            alert('Geocode was not successful for the following reason: ' + status);
          
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

	updateMap();

	$('#edit-task').click(function(e){
		var id = $('#id').text().trim();
		
		var params = $.param({
			id: id
		});
		window.location.href = "/tasks/edit?" + params;
	});
});