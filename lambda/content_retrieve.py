import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration, validate_keys
from models.content import Content

session = create_db_session()

@migration
@validate_keys(['program_code', 'deployment_id'])
def lambda_handler(event, context):
    content = session.query(Content) \
        .filter(
            Content.program_code == event['program_code'],
            Content.deployment_id == event['deployment_id']
        ) \
        .first()

    if content:
        return {
            'status': 200,
            'content': content.to_dict()
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
