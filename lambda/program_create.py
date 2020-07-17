import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from models.program import Program
from models.content import Content
from decorators import migration, validate_keys


keys = ['name', 'project', 'amount_deployment',
        'deployment_length', 'first_deployment',
        'feedback_frequency', 'feedback_frequency2']

session = create_db_session()

@migration
@validate_keys(keys)
def lambda_handler(event, context):
    try:
        program = Program(**event)
        deployments = program.default_deployments()
        contents = [Content(program_code=deplo.project, deployment_id=str(i))
            for i, deplo in enumerate(deployments)]

        session.add(program)
        session.add_all(deployments)
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
