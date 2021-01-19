from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.project import Project
from models.program import Program

session = create_db_session()

@validate_keys(['project_code'])
def lambda_handler(event, context):
    project = session.query(Project) \
        .filter(Project.program_code == event['project_code']) \
        .first()

    validate_user_access(event, project)

    program = session.query(Program) \
        .filter(Program.program_code == event['project_code']) \
        .first()

    validate_user_access(event, program)

    if program:
        return {
            'status': 200,
            'program_code': program.program_code,
            'program': { **program.to_dict(), 'name': project.name }
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
