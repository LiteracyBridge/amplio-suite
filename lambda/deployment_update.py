import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration, validate_keys
from models.deployment import Deployment

session = create_db_session()

@migration
@validate_keys(['program_code', 'items'])
def lambda_handler(event, context):
    try:
        for deplo in event['items']:
            session.query(Deployment) \
                .filter(
                    Deployment.project == event['program_code'],
                    Deployment.deployment == deplo['deployment']
                ) \
                .update({ 'startdate': deplo['startdate'], 'enddate': deplo['enddate'] })

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
