import sys
sys.path.append('/var/task/package')

from enum import Enum
from datetime import datetime
from dateutil.relativedelta import relativedelta

from utils import create_db_session
from models.program import Program
from models.content import Content
from models.deployment import Deployment
from decorators import migration, validate_keys


class DeploymentFreq(Enum):
    one_month = 1
    one_quarter = 3
    six_months = 6
    one_year = 12

keys = ['name', 'project', 'amount_deployment',
        'deployment_length', 'first_deployment',
        'feedback_frequency', 'feedback_frequency2']

empty_playlist = [
    {
        'title': 'Playlist 1',
        'audience': '',
        'messages': [
            {
                'title': "Message Title 1",
                'language': '',
                'format': '',
                'default_category': '',
                'variant': '',
                'sdg_goal': '',
                'sdg_target': ''
            }
        ]
    }
]

session = create_db_session()

@migration
@validate_keys(keys)
def lambda_handler(event, context):
    try:
        program = Program(**event)
        session.add(program)
        session.commit()
    except ValueError as err:
        return {
            'status': 422,
            'error': str(err)
        }

    # Populate the deployment table
    increment = DeploymentFreq[event['deployment_length']].value
    for i in range(1, event['amount_deployment'] + 1):
        startdate = datetime.strptime(event['first_deployment'], '%Y-%m-%d') + relativedelta(months=increment * (i - 1))
        enddate = datetime.strptime(event['first_deployment'], '%Y-%m-%d') + relativedelta(months=increment * i)

        data = {
            'project': event['project'],
            'deployment': str(i),
            'deploymentname': str(i),
            'deploymentnumber': i,
            'startdate': startdate,
            'enddate': enddate,
            'component': ''
        }

        deployment = Deployment(**data)
        session.add(deployment)
        session.commit()

    # Populate the content table
    for i in range(1, event['amount_deployment'] + 1):
        data = {
            'program_code': event['project'],
            'deployment_id': str(i),
            'content': empty_playlist
        }

        content = Content(**data)
        session.add(content)
        session.commit()

    return {
        'status': 202,
        'message': 'successfully created program',
        'program_id': program.id
    }
