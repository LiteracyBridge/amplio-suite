from utils import create_db_session, validate_user_access
from models.project import Project
from models.program import Program
from models.content import Content
from models.roadmap import Roadmap
from decorators import validate_keys


keys = ['programCode', 'name', 'sdg_goals', 'listening_models',
        'deployments_length', 'deployments_count', 'deployments_first',
        'feedback_frequency', 'feedback_frequency_other', 'languages']

session = create_db_session()

@validate_keys(keys)
def lambda_handler(event, context):
    try:
        project = session.query(Project) \
            .filter(Project.projectcode.ilike(event['programCode'].lower())) \
            .first()

        project.project = event['name']
        project.projectcode = event['programCode']

        program = Program(
            projectcode = project.projectcode,
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

        deployments = program.default_deployments()
        contents = [Content(program_code=deplo.project, deployment=deplo.deployment)
            for deplo in deployments]

        roadmap = Roadmap(
            program_code = project.projectcode,
            completed = [1]
        )

        session.flush()
        session.add(program)
        session.flush()
        session.add_all(deployments)
        session.flush()
        session.add_all(contents)
        session.commit()
        session.add(roadmap)
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
