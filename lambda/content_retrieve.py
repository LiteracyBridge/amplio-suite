from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.content import Content

session = create_db_session()

@validate_keys(['program_code', 'deployment'])
def lambda_handler(event, context):
    content = session.query(Content) \
        .filter(
            Content.program_code == event['program_code'],
            Content.deployment == event['deployment']
        ) \
        .first()

    validate_user_access(event, content)

    if content:
        return {
            'status': 200,
            **content.to_dict()
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
