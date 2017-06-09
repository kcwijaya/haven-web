//var host = 'https://129.152.41.24/ords/pdb1/havenapi3/havenapi';
var host = 'https://havenapi.herokuapp.com';
var request = require('request');

exports.getAdmins = function(token, callback){
	request.get(host + "/admins/", {
      'auth': {
        'bearer': token
      }
    }, callback);
}

exports.getAdminByID = function(token, id, callback){
	request.get(host + "/admins/" + id, {
      'auth': {
        'bearer': token
      }
    }, callback);
}

exports.getDisclaimers = function(token, callback){
	request.get(host + "/disclaimers/"
    , callback);	
}

exports.getOrganizations = function(token, callback){
	request.get(host + "/organizations/", {
      'auth': {
        'bearer': token
      }
    }, callback);	
}

exports.getOrganizationByID = function(token, id, callback){
	request.get(host + "/organizations/" + id, {
      'auth': {
        'bearer': token
      }
    }, callback);	
}

exports.getSeverity = function(token,callback){
	request.get(host + "/severity/", {
      'auth': {
        'bearer': token
      }
    }, callback);	
}

exports.getSkills = function(token, callback){
	// request.get(host + "/skills/", {
 //      'auth': {
 //        'bearer': token
 //      }
 //    }, callback);	

 request.get(host + "/skills/", callback);	
}

exports.getAllTasks = function(token, callback){
 	request.get(host + "/tasks/", {
      'auth': {
        'bearer': token
      }
    }, callback);
}

exports.addNewTask = function(token, task, callback){
	var options = {
	    headers: {
	      'CREATOR_ID': task.creator,
	      'DESCRIPTION': task.description,
	      'INSTRUCTIONS': task.instructions,
	      'LOCATION': task.location,
	      'NUM_VOLUNTEERS': task.num_volunteers,
	      'ORGANIZATION_ID': task.organization,
	      'SEVERITY_LEVEL': task.severity,
	      'STATUS': task.status,
	      'TITLE': task.title,
	      'LATITUDE': task.latitude,
	      'LONGITUDE': task.longitude,
	      'START_TIME': task.start_time,
	    },
	    auth: {
	      'bearer': token
	    },
	    uri: host + "/tasks/",
	    method: 'POST'
  	};

    request(options, callback);
}

exports.getTaskByID = function(token, id, callback){
	request.get(host + "/tasks/" + id, {
      'auth': {
        'bearer': token
      }
    }, callback);	
}

exports.getUsers = function(token, callback){
	request.get(host + "/users/", {
      'auth': {
        'bearer': token
      }
    }, callback);	
}

exports.getUserByID = function(token, id, callback){
	request.get(host + "/users/" + id, {
      'auth': {
        'bearer': token
      }
    }, callback);	
}

exports.getTaskDisclaimers = function(token, id, callback){
	request.get(host + "/tasks/disclaimers/" + id, {
		'auth': {
			'bearer': token
		}
	}, callback);
}

exports.addTaskDisclaimer = function(token, taskID, disclaimerID, callback){
	var options = {
		uri: host + "/tasks/disclaimers/" + taskID,
		headers: {
			'disclaimer_id': disclaimerID
		},			
		auth: {
			'bearer': token
		},
		method: 'POST'
	}

	request(options, callback);
	
}

exports.deleteTaskDisclaimer = function(token, taskID, disclaimerID, callback){
	var options = {
		uri: host + "/tasks/disclaimers/" + taskID,
		headers: {
			'disclaimer_id': disclaimerID
		},			
		auth: {
			'bearer': token
		},
		method: 'DELETE'
	}

	request(options, callback);
}

exports.addTaskVolunteer = function(token, userID, taskID, callback){
	console.log(typeof taskID);
		console.log("Adding task " + taskID + " to user " + userID);
		var options = {
		uri: host + "/users/tasks/" + userID,
		headers: {
			'task_id': taskID
		},			
		auth: {
			'bearer': token
		},
		method: 'POST'
	}

	console.log(options.uri);
	request(options, callback);
}

exports.deleteTaskVolunteer = function(token, userID, taskID, callback){
		var options = {
		uri: host + "/users/tasks/" + userID,
		headers: {
			'task_id': taskID
		},			
		auth: {
			'bearer': token
		},
		method: 'DELETE'
	}

	request(options, callback);
}

exports.getTaskVolunteers = function(token, id, callback){
	request.get(host + "/tasks/users/" + id, {
		'auth': {
			'bearer': token
		}
	}, callback);
}

exports.getTaskSkills = function(token, id, callback){
	request.get(host + "/tasks/skills/" + id, {
		'auth': {
			'bearer': token
		}
	}, callback);
}

exports.addTaskSkill = function(token, taskID, skillID, callback){
	var options = {
		uri: host + "/tasks/skills/" + taskID,
		headers: {
			'skill_id': skillID
		},			
		auth: {
			'bearer': token
		},
		method: 'POST'
	}

	request(options, callback);
	
}

exports.deleteTaskSkill = function(token, taskID, skillID, callback){
	var options = {
		uri: host + "/tasks/skills/" + taskID,
		headers: {
			'skill_id': skillID
		},			
		auth: {
			'bearer': token
		},
		method: 'DELETE'
	}

	request(options, callback);
}

exports.getAllTemplates = function(token, callback){
	request.get(host + "/templates/", {
		'auth': {
			'bearer': token
		}
	}, callback);
}

exports.addNewTemplate = function(token, task, callback){
	var options = {
	    headers: {
	      'CREATOR_ID': task.creator,
	      'DESCRIPTION': task.description,
	      'INSTRUCTIONS': task.instructions,
	      'NUM_VOLUNTEERS': task.volunteers,
	      'TITLE': task.title
	    },
	    auth: {
	      'bearer': token
	    },
	    uri: host + "/templates/",
	    method: 'POST'
  	};

    request(options, callback);
}

exports.editTask = function(token, task, callback){
	var options = {
	    headers: {
		    'CREATOR_ID':task.creatorID,
			'LOCATION' :task.location,
			'ORGANIZATION_ID':task.organization,
			'NUM_VOLUNTEERS' :task.num_volunteers,
			'DESCRIPTION' : task.description,
			'STATUS' :task.status,
			'TITLE' :task.title,
			'INSTRUCTIONS': task.instructions,
			'SEVERITY_LEVEL' : task.severity,
			'START_TIME': task.start_time,
			'TASK_ID': task.id
	    },
	    auth: {
	      'bearer': token
	    },
	    uri: host + "/tasks/" + task.id,
	    method: 'PUT'
  	};
    request(options, callback);
}

exports.editTemplate = function(token, template, callback){
	var options = {
	    headers: {
		    'CREATOR_ID':template.creatorID,
			'LOCATION' : template.location,
			'NUM_VOLUNTEERS' :template.num_volunteers,
			'DESCRIPTION': template.description,
			'TITLE' :template.title,
			'INSTRUCTIONS':template.instructions,
			'ID': template.id
	    },
	    auth: {
	      'bearer': token
	    },
	    uri: host + "/templates/" + template.id,
	    method: 'PUT'
  	};
    request(options, callback);
}

exports.getTemplateByID = function(token, id, callback){
	request.get(host + '/templates/' + id, {
		'auth': {
			'bearer': token
		}	
	}, callback);
}


exports.getTemplateByID = function(token, id, callback){
	request.get(host + '/templates/' + id, {
		'auth': {
			'bearer': token
		}	
	}, callback);
}

exports.getTemplateDisclaimers = function(token, id, callback){
	request.get(host + "/templates/disclaimers/" + id, {
		'auth': {
			'bearer': token
		}
	}, callback);
}

exports.addTemplateDisclaimer = function(token, templateID, disclaimerID, callback){
	var options = {
		uri: host + "/templates/disclaimers/" + templateID,
		headers: {
			'disclaimer_id': disclaimerID
		},			
		auth: {
			'bearer': token
		},
		method: 'POST'
	}

	request(options, callback);
	
}

exports.deleteTemplateDisclaimer = function(token, templateID, disclaimerID, callback){
	var options = {
		uri: host + "/tasks/disclaimers/" + templateID,
		headers: {
			'disclaimer_id': disclaimerID
		},			
		auth: {
			'bearer': token
		},
		method: 'DELETE'
	}

	request(options, callback);
}

exports.getTemplateSkills = function(token, id, callback){
	request.get(host + "/templates/skills/" + id, {
		'auth': {
			'bearer': token
		}
	}, callback);
}

exports.addTemplateSkill = function(token, templateID, skillID, callback){
	var options = {
		uri: host + "/templates/skills/" + templateID,
		headers: {
			'skill_id': skillID
		},			
		auth: {
			'bearer': token
		},
		method: 'POST'
	}

	request(options, callback);
	
}

exports.deleteTemplateSkill = function(token, templateID, skillID, callback){
	var options = {
		uri: host + "/templates/skills/" + templateID,
		headers: {
			'skill_id': skillID
		},			
		auth: {
			'bearer': token
		},
		method: 'DELETE'
	}

	request(options, callback);
}
