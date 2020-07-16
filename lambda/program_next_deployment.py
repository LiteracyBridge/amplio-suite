import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from models.program import Program
from decorators import migration, validate_keys


session = create_db_session()

@migration
@validate_keys(['program_code'])
def lambda_handler(event, context):
    program = session.query(Program) \
        .filter(Program.project == event['program_code']) \
        .first()
    deployment = program.next_deployments()

    #
    session.query(Program) \
        .filter(Program.project == event['program_code']) \
        .update({'amount_deployment': program.amount_deployment + 1})

    session.add(deployment)
    session.commit()

    return {
        'status': 200,
        'message': 'new deployment created',
        'data': { **deployment.to_dict() }
    }
