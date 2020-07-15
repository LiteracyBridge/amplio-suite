import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration, validate_keys
from models.program import Program

session = create_db_session()

@migration
@validate_keys(['project_code'])
def lambda_handler(event, context):
    program = session.query(Program) \
        .filter(Program.project == event['project_code']) \
        .first()

    if program:
        return {
            'status': 200,
            'program': program.to_dict()
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
