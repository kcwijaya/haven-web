$(document).ready(function (){
	$.ajax({
		type: "GET",
		url: "https://129.152.41.24/ords/pdb1/havenapi3/havenapi/tasks/", 
		success: function (res){
			console.log(res);
		},
		error: function (res){
			console.log(res);
		}
	});
});