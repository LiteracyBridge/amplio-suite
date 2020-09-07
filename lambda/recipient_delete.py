from utils import create_db_session
from decorators import migration, validate_keys
from models.recipient import Recipient

session = create_db_session()

@migration
@validate_keys(['program_code', 'recipient_id'])
def lambda_handler(event, context):
    try:
        deployment = session.query(Recipient) \
            .filter(
                Recipient.program_code == event['program_code'],
                Recipient.recipient_id == event['recipient_id']
            ) \
            .first()

        session.delete(deployment)
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
