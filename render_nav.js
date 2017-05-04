$(document).ready(function(){

	Handlebars.registerPartial("navbar", `<nav class="bottom-line navbar navbar-toggleable-md navbar-light bg-faded">
		<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="navbar-brand right-vertical-line">
			<img src="../imgs/logo.png" id="logo"/>
		</div>
		<div class="collapse navbar-collapse" id="navbarText">
			<ul class="navbar-nav mr-auto right-align">
				<li class="nav-item">
					<a class="nav-link {{home}}" href="/home">Home </a>
				</li>
				<li class="nav-item">
					<a class="nav-link {{task}}" href="#">Task List</a>
				</li>
				<li class="nav-item">
					<a class="nav-link {{create}}" href="/create">Create Task</a>
				</li>
				<li class="nav-item">
					<a class="nav-link {{browse}}" href="#">Browse Templates</a>
				</li>
			</ul>
		</div>
	</nav>`);

//Retrieve the template data from the HTML .
var template = $('#render-navbar').html();

//Compile the template data into a function
var templateScript = Handlebars.compile(template);

var html = templateScript();
//html = 'My name is Ritesh Kumar . I am a developer.'

$(document.body).append(html);
});
			