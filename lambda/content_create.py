from utils import create_db_session
from decorators import migration, validate_keys
from models.content import Content

session = create_db_session()

@migration
@validate_keys(['program_code', 'deployment', 'content'])
def lambda_handler(event, context):
    try:
        content = Content(**event)
    except ValueError as err:
        return {
            'status': 422,
            'error': str(err)
        }

    session.add(content)
    session.commit()

    return {
        'status': 202,
        'message': 'successfully created content'
    }
