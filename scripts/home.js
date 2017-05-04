$(document).ready(function (){
	$('#create-account').click(function (e){
		var first = $("#firstName").val();
		var last = $('#lastName').val();
		var email = $('#email').val();
		var org = $('#organization').val();

		if (first == '' || typeof first == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();
			$('#first-req').show();
			$('#first-container').addClass('has-danger');
		}
		else
		{
			$('#first-req').hide();
			$('#first-container').removeClass('has-danger');

		}


		if (last == '' || typeof last == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();
			$('#last-req').show();
			$('#last-container').addClass('has-danger');

		}
		else
		{
			$('#last-req').hide();
			$('#last-container').removeClass('has-danger');
		}


		if (email == '' || typeof email == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();

			$('#email-req').show();
			$('#email-container').addClass('has-danger');
		}
		else
		{
			$('#email-req').hide();
			$('#email-container').removeClass('has-danger');
		}


		if (org == '' || typeof org == 'undefined')
		{
			e.preventDefault();
			e.stopPropagation();
			$('#org-req').show();
			$('#org-container').addClass('has-danger');
		}
		else
		{
			$('#last-container').removeClass('has-danger');
			$('#org-req').hide();
		}
	});
});