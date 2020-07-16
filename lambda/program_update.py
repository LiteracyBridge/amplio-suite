import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration, validate_keys
from models.program import Program

session = create_db_session()

@migration
@validate_keys(['program_code'])
def lambda_handler(event, context):
    try:
        session.query(Program) \
            .filter(Program.project == event['program_code']) \
            .update({ 'name': event['name']})

        session.commit()

        return {
            'status': 202,
            'message': 'successfully update program'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
