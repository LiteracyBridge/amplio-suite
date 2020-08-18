from utils import create_db_session
from decorators import migration
from models.listening_model import ListeningModel

session = create_db_session()

@migration
def lambda_handler(event, context):
    data = session.query(ListeningModel).all()

    return {
        'statusCode': 200,
        'data': [model.to_dict() for model in data]
    }
