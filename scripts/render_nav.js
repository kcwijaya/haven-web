$(document).ready(function(){

	Handlebars.registerPartial('navbar', `<nav class="bottom-line navbar navbar-toggleable-md navbar-light bg-faded">
		<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="navbar-brand right-vertical-line">
			<img src="../imgs/logo.png" id="logo"/>
		</div>
		<div class="row collapse navbar-collapse" id="navbarText">
			<ul class="col-md-8 navbar-nav mr-auto right-align">
				<li class="nav-item">
					<a class="nav-link {{home}}" href="/home">Home </a>
				</li>
				{{#unless signin}}
				<li class="nav-item">
					<a class="nav-link {{task}}" href="/tasks">Task List</a>
				</li>
				<li class="nav-item">
					<a class="nav-link {{create}}" href="/create">Create Task</a>
				</li>
				<li class="nav-item">
					<a class="nav-link {{template}}" href="/templates">Browse Templates</a>
				</li>
				<li class="nav-item">
					<a class="nav-link {{volunteers}}" href="/volunteers">Volunteers</a>
				</li>
				<li class="nav-item">
					<a class="nav-link {{volunteers}}" href="/properties">Skills/Disclaimers</a>
				</li>
				{{/unless}}
			</ul>

			

			{{#if signin}}
					<div id="login-buttons">
			<ul class="nav navbar-nav">
				<li style="margin-top: 1%; margin-right: 2%; color:#87898A ">Already signed up?</li>
				<li>
				<div style="text-align:center" class="social-buttons">
					<a href="/auth/facebook" class="btn btn-fb"><i class="fa fa-facebook"></i> Login </a>
				</div>
				</li>
				</div>
			{{else}}

			<div id="login-buttons">
			<div style="margin-right: 4%; float: right; text-align:center" class="social-buttons">
				<a href="/logout" style="background-color: #D33E20" class="btn btn-fb">Logout</a>
			</div>
			</div>
			{{/if}}


		</div>
		
	</nav>`);

	var template = $('#render-navbar').html();

	var templateScript = Handlebars.compile(template);

	var html = templateScript();

	$('#nav-placeholder').append(html);
});
				