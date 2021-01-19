from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist

session = create_db_session()


@validate_keys(['program_code', 'deployment_id'])
def lambda_handler(event, context):
    playlists = session.query(Playlist) \
        .filter(
            Playlist.program_code == event['program_code'],
            Playlist.deployment_id == event['deployment_id'],
        ) \
        .all()

    playlists = [validate_user_access(event, p).to_dict() for p in playlists]

    if playlists:
        return {
            'status': 200,
            'content': {
                'program_code': event['program_code'],
                'deployment_id': event['deployment_id'],
                'playlists': playlists,
            },
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
