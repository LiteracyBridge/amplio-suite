from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.content import Content

session = create_db_session()

@validate_keys(['program_code', 'deployment'])
def lambda_handler(event, context):
    try:
        content = session.query(Content) \
            .filter(
                Content.program_code == event['program_code'],
                Content.deployment == event['deployment']
            ) \
            .first()

        validate_user_access(event, content)

        new_playlist = content.add_empty_playlist()

        session.query(Content) \
            .filter(
                Content.program_code == event['program_code'],
                Content.deployment == event['deployment']
            ) \
            .update(content.to_dict())

        session.commit()

        return {
            'status': 202,
            'message': 'successfully create a new playlist',
            'playlist': new_playlist
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
