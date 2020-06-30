from amplio.rolemanager import manager

manager.open_tables()

def lambda_handler(event, context):
  event['response']['autoConfirmUser'] = False

  email = event['request']['userAttributes']['email']
  roles = manager.get_defined_roles_for_user(email)

  if not roles['program_domain']:
    raise Exception('Invalid email domain')

  # Return to Amazon Cognito
  return event
