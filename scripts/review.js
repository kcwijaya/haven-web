function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAllParameterByName(name) {
	arr = [];
    var match;
    var str = window.location.search;
    while (match = RegExp('[?&]' + name + '=([^&]*)').exec(str))
    {
    	console.log(match);
    	arr.push(match);
    	str = match['input'].substring(match['index']+match[0].length);
    	console.log(str);
    }
    return arr;
}

function addParameter(parameter)
{
	console.log(parameter);
	$("#" + parameter).append("<p>" + getParameterByName(parameter) + "</p>");
}


$(document).ready(function(){

	var parameters = ["title", "location", "description", "instructions", "severity", "time", "clock"];


	for (i = 0; i < parameters.length; i++)
	{
		addParameter(parameters[i]);
	}

	// Disclaimers
	var disclaimers = getAllParameterByName('disclaimer-[0-9]*');

	for (i = 0; i < disclaimers.length; i++)
	{
		console.log(disclaimers[i][0]);
		$('#disclaimers ul').append("<li><p>" + decodeURIComponent(disclaimers[i][1].replace(/\+/g, ' ')) + "</p></li>");
	}
	
	// Skills
	var skills = getAllParameterByName('skill-[0-9]*');
	for (i = 0; i < skills.length; i++)
	{
		$('#skills ul').append("<li><p>" + decodeURIComponent(skills[i][1].replace(/\+/g, ' ')) + "</p></li>");
	}

});
			