// When the browser is ready...
$(function() {

jQuery.validator.addMethod("lettersonly", function(value, element) 
{
return this.optional(element) || /^[a-z ]+$/i.test(value);
}, "Letters and spaces only please");


// Setup form validation on the #register-form element
$("#register-form").validate({

	// Specify the validation rules
	rules: {
		firstname: {
			required: true,
			lettersonly: true
		},
		lastname: "required",
		email: {
			required: true,
			email: true
		},
		password: {
			required: true,
			minlength: 5
		},
		agree: "required"
	},
	
	// Specify the validation error messages
	messages: {
		firstname: {
			required: "Please enter your name",
			lettersonly: "Name must only contain the characters [A-Z] - [a-z]"
		},
		lastname: "Please enter your last name",
		password: {
			required: "Please provide a password",
			minlength: "Your password must be at least 5 characters long"
		},
		email: "Please enter a valid email address",
		agree: "Please accept our policy"
	},
	
	submitHandler: function(form) {
		form.submit();
	}
});

});