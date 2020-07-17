import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration, validate_keys
from models.deployment import Deployment

session = create_db_session()

@migration
@validate_keys(['program_code', 'deployment'])
def lambda_handler(event, context):
    try:
        session.query(Deployment) \
            .filter(
                Deployment.project == event['program_code'],
                Deployment.deployment == event['deployment']
            ) \
            .delete()

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
