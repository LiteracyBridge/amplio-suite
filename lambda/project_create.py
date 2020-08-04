from utils import create_db_session
from decorators import migration, validate_keys
from models.project import Project

session = create_db_session()

@migration
@validate_keys(['name'])
def lambda_handler(event, context):
    try:
        project = Project(project= event['name'], projectcode= event['name'])
    except ValueError as err:
        return {
            'status': 422,
            'error': str(err)
        }

    session.add(project)
    session.commit()

    return {
        'status': 202,
        'message': 'successfully created project',
        'projectcode': project.projectcode
    }
