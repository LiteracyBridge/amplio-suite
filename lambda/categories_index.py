from utils import create_db_session
from decorators import migration
from models.category import Category

session = create_db_session()

@migration
def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'categories': [cat.to_dict() for cat in session.query(Category).all()]
    }
