from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist
from models.message import Message

session = create_db_session()

@validate_keys(['program_code', 'deployment_id'])
def lambda_handler(event, context):
    try:
        deployment = session.query(Deployment) \
            .filter(
                Deployment.program_code == event['program_code'],
                Deployment.id == event['deployment_id']
            ) \
            .first()

        validate_user_access(event, deployment)

        playlist = Playlist(
            program_code = deployment.program_code,
            deployment_id = deployment.id,
        )
        session.add(playlist)
        session.flush()

        message = Message(
            program_code = playlist.program_code,
            playlist_id = playlist.id,
        )
        session.add(message)
        session.flush()

        session.commit()

        return {
            'status': 202,
            'message': 'successfully create a new playlist',
            'playlist': playlist.to_dict(),
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
