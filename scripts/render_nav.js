$(document).ready(function(){

	Handlebars.registerPartial('navbar', `<nav class="bottom-line navbar navbar-toggleable-md navbar-light bg-faded">
		<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="navbar-brand right-vertical-line">
			<img src="../imgs/logo.png" id="logo"/>
		</div>
		<div class="row collapse navbar-collapse" id="navbarText">
			<ul class="col-md-7 navbar-nav mr-auto right-align">
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
				{{/unless}}
			</ul>
		</div>
		{{#if signin}}
		<form class="col-md-5 form-inline navbar-form navbar-right" action="/login" method="post">
                    <div style="margin-right: 1%" class="form-group">
                        <input type="text" class="form-control" name="email" placeholder="Email">
                    </div>
                    <div style="margin-right: 1%" class="form-group">
                        <input type="password" class="form-control" name="password" placeholder="Password">
                    </div>
                    <button style="box-shadow: 0px 0px 0px" type="submit" class="btn btn-primary btn-default">Sign In</button>
                </form>

		{{/if}}
	</nav>`);
	var template = $('#render-navbar').html();

	var templateScript = Handlebars.compile(template);

	var html = templateScript();

	$('#nav-placeholder').append(html);
});
				