from utils import create_db_session, validate_user_access
from decorators import migration, validate_keys
from models.content import Content

session = create_db_session()

@migration
@validate_keys(['program_code', 'deployment', 'playlist_index'])
def lambda_handler(event, context):
    try:
        content = session.query(Content) \
            .filter(
                Content.program_code == event['program_code'],
                Content.deployment == event['deployment']
            ) \
            .first()
        
        validate_user_access(event, content)

        message = content.add_empty_message(event['playlist_index'])

        session.query(Content) \
            .filter(
                Content.program_code == event['program_code'],
                Content.deployment == event['deployment']
            ) \
            .update(content.to_dict())

        session.commit()

        return {
            'status': 202,
            'message': message
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
