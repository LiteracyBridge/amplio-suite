from utils import create_db_session
from decorators import migration, validate_keys
from models.deployment import Deployment

session = create_db_session()

@migration
@validate_keys(['program_code'])
def lambda_handler(event, context):
    deployments = session.query(Deployment) \
        .filter(Deployment.project == event['program_code'])

    deployments = [deplo.to_dict() for deplo in deployments]
    deployments = sorted(deployments, key=lambda deplo: deplo['deploymentnumber'])

    if deployments:
        return {
            'status': 200,
            'deployments': deployments
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
