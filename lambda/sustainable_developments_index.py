import sys
sys.path.append('/var/task/package')

from utils import create_db_session
from models.sustainable_development import SustainableDevelopmentGoals, SustainableDevelopmentTargets

session = create_db_session()

def lambda_handler(event, context):
    goals = session.query(SustainableDevelopmentGoals).all()
    data = [{
        'goal': goal.label,
        'section': goal.section,
        'imgUrl': goal.img_url,
        'targets': [{ 'label': target.label, 'subsection': target.subsection } for target in goal.targets]
    } for goal in goals]

    return {
        'statusCode': 200,
        'data': data
    }
