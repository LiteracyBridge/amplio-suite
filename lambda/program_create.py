from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.project import Project
from models.program import Program
from models.playlist import Playlist
from models.message import Message
from models.roadmap import Roadmap


keys = ['programCode', 'name', 'sdg_goals', 'listening_models',
        'deployments_length', 'deployments_count', 'deployments_first',
        'feedback_frequency', 'feedback_frequency_other', 'languages']

session = create_db_session()

@validate_keys(keys)
def lambda_handler(event, context):
    try:
        project = session.query(Project) \
            .filter(Project.program_code.ilike(event['programCode'].lower())) \
            .first()

        project.name = event['name']
        project.program_code = event['programCode']
        session.flush()

        program = Program(
            program_code = event['programCode'],
            country = event['country'],
            region = event['region'],
            sustainable_development_goals = event['sdg_goals'],
            listening_models = event['listening_models'],
            deployments_count = event['deployments_count'],
            deployments_length = event['deployments_length'],
            deployments_first = event['deployments_first'],
            feedback_frequency = event['feedback_frequency'],
            feedback_frequency_other = event['feedback_frequency_other'],
            languages = event['languages'],
            partner = event['partner'],
            affiliate = event['affiliate'],
        )
        session.add(program)
        session.flush()

        deployments = program.default_deployments()
        session.add_all(deployments)
        session.flush()

        playlists = [Playlist(
            program_code = deplo.program_code,
            deployment_id = deplo.id,
        ) for deplo in deployments]
        session.add_all(playlists)
        session.flush()

        messages = [Message(
            program_code = playlist.program_code,
            playlist_id = playlist.id,
        ) for playlist in playlists]
        session.add_all(messages)
        session.flush()

        roadmap = Roadmap(
            program_code = project.program_code,
            completed = [1]
        )
        session.add(roadmap)
        session.flush()

        session.commit()
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }

    return {
        'status': 202,
        'message': 'successfully created program',
        'program_id': program.id
    }
