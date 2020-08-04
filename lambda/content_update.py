from utils import create_db_session
from decorators import migration, validate_keys
from models.content import Content

session = create_db_session()

@migration
@validate_keys(['program_code', 'deployment_id', 'content'])
def lambda_handler(event, context):
    try:
        session.query(Content) \
            .filter(
                Content.program_code == event['program_code'],
                Content.deployment_id == event['deployment_id']
            ) \
            .update({'content': event['content']})

        session.commit()

        return {
            'status': 202,
            'message': 'successfully update content'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
