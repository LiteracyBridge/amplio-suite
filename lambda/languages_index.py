from utils import create_db_session
from models.language import Language

session = create_db_session()

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'languages': [lang.to_dict() for lang in session.query(Language).all()]
    }
