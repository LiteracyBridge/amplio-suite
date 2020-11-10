from utils import create_db_session, user_programs, UnauthorizedAccess
from decorators import validate_keys
from models.content import Content

session = create_db_session()

@validate_keys(['program_code', 'deployment', 'content'])
def lambda_handler(event, context):
    program_code = event['program_code']

    email = event['context']['email']

    if program_code not in user_programs(email): # FIXME: we'd prefer to check with the model rather than the program_code
        raise UnauthorizedAccess()

    try:
        session.query(Content) \
            .filter(
                Content.program_code == program_code,
                Content.deployment == event['deployment']
            ) \
            .update({'content': event['content']})

        session.commit()

        return {
            'status': 202,
            'message': 'successfully update content'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
