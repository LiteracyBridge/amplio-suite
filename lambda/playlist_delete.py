from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.playlist import Playlist
from models.deployment import Deployment

session = create_db_session()

@validate_keys(['program_code', 'playlist_id'])
def lambda_handler(event, context):
    playlist = session.query(Playlist) \
        .filter(
            Playlist.program_code == event['program_code'],
            Playlist.id == event['playlist_id'],
        ) \
        .first()

    validate_user_access(event, playlist)

    session.delete(playlist)
    session.commit()

    return {
        'status': 202,
        'message': 'successfully delete playlist'
    }
