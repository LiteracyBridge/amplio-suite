from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist
from models.message import Message

session = create_db_session()

@validate_keys(['program_code', 'playlist_id'])
def lambda_handler(event, context):
    try:
        playlist = session.query(Playlist) \
            .filter(
                Playlist.program_code == event['program_code'],
                Playlist.id == event['playlist_id']
            ) \
            .first()

        validate_user_access(event, playlist)

        message = Message(
            program_code=playlist.program_code,
            playlist_id=playlist.id,
        )
        session.add(message)
        session.commit()

        return {
            'status': 202,
            'message': 'successfully create message',
            'data': message.to_dict(),
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
