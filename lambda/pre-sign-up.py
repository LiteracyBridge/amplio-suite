from amplio.rolemanager import manager

manager.open_tables()

def lambda_handler(event, context):
  event['response']['autoConfirmUser'] = False

  email = event['request']['userAttributes']['email']
  is_known = any(manager.is_email_known(email))

  if not is_known:
    raise Exception('Invalid email domain')

  # Return to Amazon Cognito
  return event
