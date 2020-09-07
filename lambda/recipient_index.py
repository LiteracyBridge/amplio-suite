from utils import create_db_session
from decorators import migration, validate_keys
from models.recipient import Recipient

session = create_db_session()

@migration
@validate_keys(['program_code'])
def lambda_handler(event, context):
    recipients = session.query(Recipient) \
        .filter(Recipient.program_code == event['program_code'])

    recipients = [recipient.to_dict() for recipient in recipients]

    if recipients:
        return {
            'status': 200,
            'program_code': event['program_code'],
            'recipients': recipients
        }

    return {
        'status': 401,
        'error': 'Recipients not found'
    }
