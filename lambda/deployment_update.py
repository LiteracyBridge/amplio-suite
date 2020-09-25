from utils import create_db_session, user_programs, UnauthorizedAccess
from decorators import migration, validate_keys
from models.deployment import Deployment

session = create_db_session()

@migration
@validate_keys(['program_code', 'items'])
def lambda_handler(event, context):
    program_code = event['program_code']

    username = event['context']['username']

    if program_code not in user_programs(username): # FIXME: we'd prefer to check with the model rather than the program_code
        raise UnauthorizedAccess()

    try:
        for deplo in event['items']:
            session.query(Deployment) \
                .filter(
                    Deployment.project == program_code,
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
