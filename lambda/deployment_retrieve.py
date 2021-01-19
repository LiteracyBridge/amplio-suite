from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment

session = create_db_session()

@validate_keys(['program_code'])
def lambda_handler(event, context):
    deployments = session.query(Deployment) \
        .filter(Deployment.program_code == event['program_code'])

    deployments = [validate_user_access(event, deplo).to_dict() for deplo in deployments]
    deployments = sorted(deployments, key=lambda deplo: deplo['number'])

    if deployments:
        return {
            'status': 200,
            'deployments': deployments
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
