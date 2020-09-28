from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.roadmap import Roadmap

session = create_db_session()

@validate_keys(['program_code', 'completed'])
def lambda_handler(event, context):
    try:
        roadmap = session.query(Roadmap) \
        .filter(
            Roadmap.program_code == event['program_code']
        ).one_or_none()
        if not roadmap:
            roadmap = Roadmap(**event)
        
        validate_user_access(event, roadmap)

        roadmap.completed = event['completed']
        session.merge(roadmap)
        session.commit()

        return {
            'status': 202,
            'message': 'successfully update roadmap'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
