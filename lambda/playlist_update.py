from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist

session = create_db_session()


@validate_keys(['playlists'])
def lambda_handler(event, context):
    for playlist in event['playlists']:
        session.query(Playlist) \
            .filter(
                Playlist.program_code == playlist['program_code'],
                Playlist.id == playlist['id'],
            ) \
            .update({
                'position': playlist['position'],
                'title': playlist['title'],
                'audience': playlist['audience'],
            })

    session.commit()

    return {
        'status': 202,
        'message': 'successfully update playlists'
    }
