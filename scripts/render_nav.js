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
				{{/unless}}
			</ul>

			

			{{#if signin}}
				<div id="login-buttons">
					<ul class="nav navbar-nav">
        <li style="margin-right: 2%; color:#87898A ">Already have an account?</li>
        <li class="dropdown">
          <a href="#" id="login-drop" class="dropdown-toggle" data-toggle="dropdown"><b>Login</b> <span class="caret"></span></a>
			<ul id="login-dp" class="dropdown-menu-right dropdown-menu">
				<li>
					 <div class="row">
							<div class="col-md-12">
								Login via
								<div style="width:100%; text-align:center" class="social-buttons">
									<a href="/auth/facebook" class="btn btn-fb"><i class="fa fa-facebook"></i> Facebook</a>
								</div>
                                <div style="text-align: center"> or</div>
                                <hr>
								 <form class="form" role="form" method="post" action="login" accept-charset="UTF-8" id="login-nav">
										<div class="form-group">
											 <label class="sr-only" for="exampleInputEmail2">Email address</label>
											 <input type="email" class="form-control" id="exampleInputEmail2" placeholder="Email address" required>
										</div>
										<div class="form-group">
											 <label class="sr-only" for="exampleInputPassword2">Password</label>
											 <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password" required>
                                             <div class="help-block text-right"><a href="">Forget the password ?</a></div>
										</div>
										<div class="form-group">
											 <button type="submit" class="btn btn-primary btn-block">Sign in</button>
										</div>
										<!--
										<div class="checkbox">
											 <label>
											 <input type="checkbox"> keep me logged-in
											 </label>
										</div>
										-->
								 </form>
							</div>
					 </div>
				</li>
			</ul>
        </li>
      </ul>
				</div>
			{{/if}}
		</div>
		
	</nav>`);
	var template = $('#render-navbar').html();

	var templateScript = Handlebars.compile(template);

	var html = templateScript();

	$('#nav-placeholder').append(html);
});
				