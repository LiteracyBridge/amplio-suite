from utils import create_db_session
from decorators import migration, validate_keys
from models.content import Content

session = create_db_session()

@migration
@validate_keys(['program_code'])
def lambda_handler(event, context):
    if 'deployment' in event:
        content = session.query(Content) \
            .filter(
                Content.program_code == event['program_code'],
                Content.deployment == event['deployment']
            ) \
            .first()
    else:
        content = session.query(Content) \
            .filter(Content.program_code == event['program_code']) \
            .first()

    if content:
        return {
            'status': 200,
            **content.to_dict()
        }

    return {
        'status': 401,
        'error': 'Content not found'
    }
