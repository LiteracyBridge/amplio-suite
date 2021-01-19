from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist
from models.message import Message

session = create_db_session()

@validate_keys(['program_code', 'message_id'])
def lambda_handler(event, context):
    message = session.query(Message) \
        .filter(
            Message.program_code == event['program_code'],
            Message.id == event['message_id'],
        ) \
        .first()

    validate_user_access(event, message)

    session.delete(message)
    session.commit()

    return {
        'status': 202,
        'message': 'successfully delete message'
    }
