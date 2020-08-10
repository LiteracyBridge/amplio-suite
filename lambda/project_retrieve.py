import json

from utils import create_db_session
from decorators import migration, validate_keys
from models.project import Project
from models.deployment import Deployment

session = create_db_session()

@migration
@validate_keys(['project_id'])
def lambda_handler(event, context):
    try:
        project = session.query(Project).get(event['project_id'])
        deployments = session.query(Deployment).filter(Deployment.project == event['project_id'])
    except ValueError as err:
        return {
            'status': 404,
            'error': str(err)
        }
    return {
        'status': 200,
        'project': project.to_dict(),
        'deployments': [deployment.to_dict() for deployment in deployments]
    }
