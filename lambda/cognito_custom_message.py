message_new_user = """Thanks for signing up in Amplio-Suite.
Please use the follow verification code on the login {####}"""

message_forgot_pass = "Please use this reset token to reset your password in Amplio-Suite {####}"

def lambda_handler(event, context):
	if event['triggerSource'] == 'CustomMessage_SignUp':
		event['response']['emailSubject'] = "Welcome to Amplio-Suite"
		event['response']['emailMessage'] = message_new_user
	elif event['triggerSource'] == 'CustomMessage_ForgotPassword':
		event['response']['emailSubject'] = "Forgot password for Amplio-Suite"
		event['response']['emailMessage'] = message_forgot_pass

	return event
