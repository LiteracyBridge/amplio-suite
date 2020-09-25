from utils import create_db_session, user_programs, UnauthorizedAccess
from decorators import migration, validate_keys
from models.recipient import Recipient

session = create_db_session()

@migration
@validate_keys(['program_code', 'recipient_id'])
def lambda_handler(event, context):
    program_code = event['program_code']

    username = event['context']['username']

    if program_code not in user_programs(username): # FIXME: we'd prefer to check with the model rather than the program_code
        raise UnauthorizedAccess()

    try:
        session.query(Recipient) \
            .filter(
                Recipient.program_code == program_code,
                Recipient.recipient_id == event['recipient_id']
            ) \
            .delete()

        session.commit()

        return {
            'status': 202,
            'message': 'successfully delete recipient'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
