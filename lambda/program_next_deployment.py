from utils import create_db_session, validate_user_access
from models.program import Program
from models.content import Content
from decorators import validate_keys


session = create_db_session()

@validate_keys(['program_code'])
def lambda_handler(event, context):
    program = session.query(Program) \
        .filter(Program.projectcode == event['program_code']) \
        .first()
    
    validate_user_access(event, program)

    deployment = program.next_deployments()
    content = Content(program_code=deployment.project, deployment=deployment.deployment)

    #
    session.query(Program) \
        .filter(Program.projectcode == event['program_code']) \
        .update({'deployments_count': program.deployments_count + 1})

    session.flush()
    session.add(deployment)
    session.flush()
    session.add(content)
    session.commit()

    return {
        'status': 200,
        'message': 'new deployment created',
        'data': { **deployment.to_dict() }
    }
