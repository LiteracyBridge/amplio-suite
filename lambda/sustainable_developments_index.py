import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration
from models.sustainable_development import SustainableDevelopmentGoals, SustainableDevelopmentTargets

session = create_db_session()

@migration
def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'goals': [goal.to_dict() for goal in session.query(SustainableDevelopmentGoals).all()],
        'targets': [target.to_dict() for target in session.query(SustainableDevelopmentTargets).all()]
    }
