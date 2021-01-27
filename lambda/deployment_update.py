from utils import create_db_session, user_programs, UnauthorizedAccess
from decorators import validate_keys
from models.deployment import Deployment

session = create_db_session()

@validate_keys(['program_code', 'deployments'])
def lambda_handler(event, context):
    program_code = event['program_code']
    email = event['context']['email']

    if program_code not in user_programs(email): # FIXME: we'd prefer to check with the model rather than the program_code
        raise UnauthorizedAccess()

    try:
        for deplo in event['deployments']:
            session.query(Deployment) \
                .filter(
                    Deployment.program_code == deplo['program_code'],
                    Deployment.id == deplo['id']
                ) \
                .update({
                    'start_date': deplo['start_date'],
                    'end_date': deplo['end_date']
                })

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
