from utils import create_db_session
from models.project import Project
from models.program import Program
from models.content import Content
from decorators import migration, validate_keys


keys = ['programCode', 'name', 'sdg_goals', 'listening_models',
        'deployments_length', 'deployments_amount', 'deployments_first',
        'feedback_frequency', 'feedback_frequency_other', 'languages']

session = create_db_session()

@migration
@validate_keys(keys)
def lambda_handler(event, context):
    try:
        project = Project(projectcode=event['programCode'], project=event['name'], active=False) # TODO: default active=false on the model
        program = Program(
            projectcode = project.projectcode, # we'd eventually switch this to project=project
            sustainable_development_goals = event['sdg_goals'],
            listening_models = event['listening_models'],
            deployments_amount = event['deployments_amount'],
            deployments_length = event['deployments_length'],
            deployments_first = event['deployments_first'],
            feedback_frequency = event['feedback_frequency'],
            feedback_frequency_other = event['feedback_frequency_other'],
            languages = event['languages'],
        )
        deployments = program.default_deployments()
        contents = [Content(program_code=deplo.project, deployment_id=deplo.deployment)
            for deplo in deployments]

        session.add(project)
        session.flush()
        session.add(program)
        session.flush()
        session.add_all(deployments)
        session.flush()
        session.add_all(contents)
        session.commit()
    except ValueError as err:
        return {
            'status': 422,
            'error': str(err)
        }

    return {
        'status': 202,
        'message': 'successfully created program',
        'program_id': program.id
    }
