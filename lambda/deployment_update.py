import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration, validate_keys
from models.deployment import Deployment

session = create_db_session()

@migration
@validate_keys(['program_code', 'deployment_id'])
def lambda_handler(event, context):
    try:
        session.query(Deployment) \
            .filter(
                Deployment.program == event['program_code'],
                Deployment.deployment_id == event['deployment_id']
            ) \
            .update(**event)

        session.commit()

        return {
            'status': 202,
            'message': 'successfully update deployment'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
