//var host = 'https://129.152.41.24/ords/pdb1/havenapi3/havenapi';
var host = 'https://havenapi.herokuapp.com';
var request = require('request');
var ths = this;

exports.editAdmin = function(admin, callback){
	var options = {
		json: true, 
		body: admin,
		uri: hosts + "/admins/" + admin.id, 
		method: "PATCH"
	}

	request(options, callback);
}

exports.deleteAdmin = function(adminID, callback){
	var options ={
		method: "DELETE", 
		uri: host + "/admins/" + adminID
	}

	request(options, callback);
}

exports.addAdmin = function(admin, callback){
	var options ={
		json: true,
		body: admin, 
		uri: host + "/admins",
		method: "POST"
	}
	request(options, callback);
}

exports.getAdmins = function( callback){
	request.get(host + "/admins", callback);
}

exports.getAdminByID = function( id, callback){
	request.get(host + "/admins/" + id, callback);
}

exports.getDisclaimers = function( callback){
	request.get(host + "/disclaimers/", callback);	
}

exports.getOrganizations = function( callback){
	request.get(host + "/organizations", callback);	
}

exports.getOrganizationByID = function( id, callback){
	request.get(host + "/organizations/" + id, callback);	
}

exports.getSeverities = function(callback){
	request.get(host + "/severities", callback);	
}

exports.getSkills = function( callback){
 request.get(host + "/skills", callback);	
}

exports.getAllTasks = function( callback){
 	request.get(host + "/tasks", callback);
}

exports.addNewTask = function( task, callback){
	var options = {
		json: true,
	    body: task,
	    uri: host + "/tasks",
	    method: 'POST'
  	};

    request(options, callback);
}

exports.getTaskByID = function( id, callback){
	request.get(host + "/tasks/" + id, callback);	
}

exports.getUsers = function( callback){
	request.get(host + "/users", callback);	
}

exports.addUser = function(user, callback){
	var options ={
		json: true,
		body: user,
		uri: host + "/users",
		method: 'POST'
	}

	request(options, callback);
}

exports.deleteUser = function(userID, callback){
	var options ={
		uri: host + "/users/" + userID,
		method: 'DELETE'
	}

	request(options, callback);
}



exports.getUserByID = function(id, callback){
	request.get(host + "/users/" + id, callback);	
}

exports.getTaskDisclaimers = function( id, callback){
	request.get(host + "/tasks/" + id + "/disclaimers", callback);
}

exports.addTaskDisclaimer = function( taskID, disclaimerID, callback){
	var options = {
		json: true,
		uri: host + "/tasks/" + taskID + "/disclaimers",
		body: {
			task_id: taskID,
			disclaimer_id: disclaimerID
		},
		method: 'POST'
	};
	request(options, callback);
}

exports.deleteTaskDisclaimer = function( taskID, disclaimerID, callback){
	var options = {
		uri: host + "/tasks/" + taskID + "/disclaimers/" + disclaimerID,
		json: true,
		body: {
			task_id: taskID,
			disclaimer_id: disclaimerID
		},
		method: 'DELETE'
	}

	request(options, callback);
}

exports.addTaskVolunteer = function( userID, taskID, callback){
	console.log("Adding task " + taskID + " to user " + userID);
	var options = {
		uri: host + "/tasks/" + taskID + "/users",
		method: 'POST',
		json: true,
		body: {
			task_id: taskID,
			user_id: userID
		}
	}
	request(options, callback);
}

exports.deleteTaskVolunteer = function( userID, taskID, callback){
	var options = {
		uri: host + "/tasks/" + taskID + "/users/" + userID,
		json: true,
		body: {
			task_id: taskID,
			user_id: userID
		},
		method: 'DELETE'
	}

	console.log(options);

	request(options, callback);
}



exports.logVolunteerHours = function(userID, taskID, hours, callback){
	
	console.log(taskID);
	console.log(userID);
	console.log(hours);
	var options = {
		uri: host + "/tasks/" + taskID + "/users/" + userID,
		json: true,
		body: {
			task_id: taskID, 
			user_id: userID, 
			hours: hours
		},
		method: 'PATCH'
	}

	request(options,callback);
}

exports.getTaskVolunteers = function(id, callback){
	console.log('hello');
	console.log("looking for..." + id);
	request.get(host + "/tasks/" + id + "/users", callback);
}

exports.getTaskSkills = function( id, callback){
	request.get(host + "/tasks/" + id +"/skills", callback);
}

exports.addTaskSkill = function( taskID, skillID, callback){
	var options = {
		uri: host + "/tasks/" + taskID + "/skills/",
		json: true,
		body: {
			task_id: taskID,
			skill_id: skillID
		},
		method: 'POST'
	}

	request(options, callback);
	
}



exports.deleteTaskSkill = function( taskID, skillID, callback){
	var options = {
		uri: host + "/tasks/" + taskID + "/skills/" + skillID,
		json: true,
		body: {
			task_id: taskID,
			skill_id: skillID
		},
		method: 'DELETE'
	}

	request(options, callback);
}

// exports.getAllTemplates = function( callback){
// 	request.get(host + "/templates/", callback);
// }

exports.getAllTemplates = function(callback){
	ths.getAllTasks(callback);
}


exports.addNewTemplate = function(task, callback){
	console.log("Adding...");
	console.log(task);
	ths.addNewTask(task, callback);
}
// exports.addNewTemplate = function( task, callback){
// 	var options = {
// 	    headers: {
// 	      'CREATOR_ID': task.creator,
// 	      'DESCRIPTION': task.description,
// 	      'INSTRUCTIONS': task.instructions,
// 	      'NUM_VOLUNTEERS': task.volunteers,
// 	      'TITLE': task.title
// 	    },
// 	    uri: host + "/templates/",
// 	    method: 'POST'
//   	};

//     request(options, callback);
// }
 

exports.editTemplate = function(template, callback)
{
	ths.editTask(template, callback);
}

exports.editTask = function( task, callback){
	var options = {
		json: true,
		body: task,
	    uri: host + "/tasks/" + task.id,
	    method: 'PATCH'
  	};
    request(options, callback);
}

// exports.editTemplate = function( template, callback){
// 	var options = {
// 	    headers: {
// 		    'CREATOR_ID':template.creatorID,
// 			'LOCATION' : template.location,
// 			'NUM_VOLUNTEERS' :template.num_volunteers,
// 			'DESCRIPTION': template.description,
// 			'TITLE' :template.title,
// 			'INSTRUCTIONS':template.instructions,
// 			'ID': template.id
// 	    },
// 	    uri: host + "/templates/" + template.id,
// 	    method: 'PUT'
//   	};
//     request(options, callback);
// }

exports.getTemplateByID = function(id, callback)
{
	ths.getTaskByID(id, callback);
}
// exports.getTemplateByID = function( id, callback){
// 	request.get(host + '/templates/' + id, callback);
// }


// exports.getTemplateByID = function( id, callback){
// 	request.get(host + '/templates/' + id, callback);
// }

exports.getTemplateDisclaimers = function(id, callback)
{
	ths.getTaskDisclaimers(id, callback);
}
// exports.getTemplateDisclaimers = function( id, callback){
// 	request.get(host + "/templates/disclaimers/" + id, callback);
// }


exports.addTemplateDisclaimer = function(templateID, disclaimerID, callback)
{
	ths.addTaskDisclaimer(templateID, disclaimerID, callback);
}
// exports.addTemplateDisclaimer = function( templateID, disclaimerID, callback){
// 	var options = {
// 		uri: host + "/templates/disclaimers/" + templateID,
// 		headers: {
// 			'disclaimer_id': disclaimerID
// 		},			
// 		method: 'POST'
// 	}

// 	request(options, callback);
	
// }

exports.deleteTemplateDisclaimers = function(templateID, disclaimerID, callback)
{
	ths.deleteTemplateDisclaimers(templateID, disclaimerID, callback);
}
// exports.deleteTemplateDisclaimer = function( templateID, disclaimerID, callback){
// 	var options = {
// 		uri: host + "/tasks/disclaimers/" + templateID,
// 		headers: {
// 			'disclaimer_id': disclaimerID
// 		},			
// 		method: 'DELETE'
// 	}

// 	request(options, callback);
// }

exports.getTemplateSkills = function(id, callback)
{
	ths.getTaskSkills(id, callback);
}
// exports.getTemplateSkills = function( id, callback){
// 	request.get(host + "/templates/skills/" + id, callback);
// }


exports.addTemplateSkill = function(templateID, skillID, callback)
{
	ths.addTaskSkill(templateID, skillID, callback);
}
// exports.addTemplateSkill = function( templateID, skillID, callback){
// 	var options = {
// 		uri: host + "/templates/skills/" + templateID,
// 		headers: {
// 			'skill_id': skillID
// 		},			
// 		method: 'POST'
// 	}

// 	request(options, callback);
	
// }

exports.deleteTemplateSkill = function(templateID, skillID, callback)
{
	ths.deleteTaskSkill(templateID, skillID, callback);
}
// exports.deleteTemplateSkill = function( templateID, skillID, callback){
// 	var options = {
// 		uri: host + "/templates/skills/" + templateID,
// 		headers: {
// 			'skill_id': skillID
// 		},			
// 		method: 'DELETE'
// 	}

// 	request(options, callback);
// }
