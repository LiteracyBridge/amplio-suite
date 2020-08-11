import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from decorators import migration
from models.sustainable_development import SustainableDevelopmentGoals, SustainableDevelopmentTargets

session = create_db_session()

@migration
def lambda_handler(event, context):
    goals = session.query(SustainableDevelopmentGoals).all()
    data = [{
        'goal': goal.label,
        'section': goal.section,
        'targets': [{ 'label': target.label, 'subsection': target.subsection } for target in goal.targets]
    } for goal in goals]

    return {
        'statusCode': 200,
        'data': data
    }
