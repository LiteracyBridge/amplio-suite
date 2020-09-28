from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.roadmap import Roadmap

session = create_db_session()

@validate_keys(['program_code'])
def lambda_handler(event, context):
    roadmap = session.query(Roadmap) \
        .filter(
            Roadmap.program_code == event['program_code']
        ) \
        .first()

    validate_user_access(event, roadmap)
    
    if roadmap:
        completed = roadmap.to_dict()['completed']
    else:
        completed = []

    return {
        'status': 200,
        'program_code': event['program_code'],
        'roadmap': completed
    }
