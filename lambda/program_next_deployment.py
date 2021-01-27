from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.program import Program
from models.playlist import Playlist
from models.message import Message

session = create_db_session()

@validate_keys(['program_code'])
def lambda_handler(event, context):
    program = session.query(Program) \
        .filter(Program.program_code == event['program_code']) \
        .first()

    validate_user_access(event, program)

    deployment = program.next_deployments()
    session.query(Program) \
        .filter(Program.program_code == event['program_code']) \
        .update({'deployments_count': program.deployments_count + 1})
    session.flush()
    session.add(deployment)
    session.flush()

    playlist = Playlist(
        program_code = deployment.program_code,
        deployment_id = deployment.id,
    )
    session.add(playlist)
    session.flush()

    message = Message(
        program_code = playlist.program_code,
        playlist_id = playlist.id
    )
    session.add(message)
    session.flush()

    session.commit()

    return {
        'status': 200,
        'message': 'new deployment created',
        'data': { **deployment.to_dict() }
    }
