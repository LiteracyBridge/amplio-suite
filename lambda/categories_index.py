from utils import create_db_session
from models.category import Category

session = create_db_session()

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'categories': [cat.to_dict() for cat in session.query(Category).all()]
    }
