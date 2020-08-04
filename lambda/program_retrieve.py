from utils import create_db_session
from decorators import migration, validate_keys
from models.project import Project
from models.program import Program

session = create_db_session()

@migration
@validate_keys(['project_code'])
def lambda_handler(event, context):
    project = session.query(Project) \
        .filter(Project.projectcode == event['project_code']) \
        .first()

    program = session.query(Program) \
        .filter(Program.projectcode == event['project_code']) \
        .first()

    if program:
        return {
            'status': 200,
            'program': { **program.to_dict(), 'name': project.project }
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
