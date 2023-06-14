$(document).ready(function() {
	$('.cancelbtn').click(function() {
		window.location.href='https://www.bronzeforever.net/'
	});
	$('#forgot-password').click(function(event) {
		event.preventDefault();
		alert('Please contact an administrator to reset your password.')
	});
	$('form').submit(handleLogin);

	function displayError(message) {
        $("#login-error").text(message);
        $("#login-error").css("display", "block");
    }

    function hideError() {
        $("#login-error").css("display", "none");
    }

	function handleLogin(event) {
		event.preventDefault();

		if (!$('input[name=username]').val()) {
			displayError('Please enter a username.');
			return;
		}

		if (!$('input[name=password]').val()) {
			displayError('Please enter a password.');
			return;
		}

		if (!$('input[name=username]').val().match(/^[\w_-]{3,16}$/)) {
			displayError('Username must be between 3 and 16 characters long and can only contain letters, numbers, and underscores.');
			return;
		}

		if (!$('input[name=password]').val().match(/^[\w!@#$%^&*?]{8,25}$/)) {
			displayError('Password must be at least 8 characters long and must contain at least twp lowercase letters, two uppercase letters and one special character.');
			return;
		}

		const username = $('input[name=username]').val();
		const password = $('input[name=password]').val();

		const encodedCredentials = btoa(`${username}:${password}`);

		$.ajax({
			url: 'https://www.bronzeforever.net/api/auth/login',
			type: 'POST',
			dataType: 'text',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': `Basic ${encodedCredentials}`,
			},
			data: JSON.stringify({
				RememberMe: document.getElementsByName("remember")[0].checked
			}),
		success: function() {
			hideError();
			let redirect_uri = '/staff/dashboard';

			const urlParams = new URLSearchParams(window.location.search);

			if (urlParams.has('redirect_uri')) {
				redirect_uri = urlParams.get('redirect_uri');
			}

			window.location.href = redirect_uri;
			// window.location.reload();
		},
			error: function(error) {
				if (error.status === 403) {
					displayError('Incorrect username or password.');
				} else if (error.status === 400) {
					displayError('Username or password is missing or doesn\'t match the requirements.');
				} else if (error.status === 404) {
					displayError('User does not exist.');
				} else if (error.status === 429) {
					displayError('Too many login attempts. Please try again later.');
				} else if (error.status === 503 || error.status === 504) {
					displayError('The server is currently unavailable.');
				} else {
					displayError('Unknown error occured.');
					console.error(error.status + ': ' + error.statusText);
				}
			}
		});
	}
});

$.ajax({
	url: 'https://www.bronzeforever.net/api/auth/validate',
	type: 'GET',
	dataType: 'text',
	headers: {
		'Content-Type': 'application/json',
	},
	xhrFields: {
		withCredentials: true
	},
	success: function() {
		let redirect_uri = '/staff/dashboard';

		const urlParams = new URLSearchParams(window.location.search);
		
		if (urlParams.has('redirect_uri')) {
			redirect_uri = urlParams.get('redirect_uri');
		}

		window.location.href = redirect_uri;
	}
});