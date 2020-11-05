from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.program import Program
from models.deployment import Deployment

session = create_db_session()

@validate_keys(['program_code', 'deployment'])
def lambda_handler(event, context):
    try:
        deployment = session.query(Deployment) \
            .filter(
                Deployment.project == event['program_code'],
                Deployment.deployment == event['deployment']
            ) \
            .first()

        validate_user_access(event, deployment)

        program = session.query(Program) \
            .filter(Program.projectcode == event['program_code']) \
            .first()

        validate_user_access(event, program)

        session.query(Program) \
            .filter(Program.projectcode == event['program_code']) \
            .update({'deployments_count': program.deployments_count - 1})

        session.flush()
        session.delete(deployment)
        session.commit()

        return {
            'status': 202,
            'message': 'successfully delete deployment'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
