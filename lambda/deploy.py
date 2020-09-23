import io
import csv
import json

from utils import create_db_session, save_to_csv
from decorators import migration, validate_keys
from models.deployment import Deployment
from models.content import Content
from models.sustainable_development import SustainableDevelopmentGoals, SustainableDevelopmentTargets


header_content = ['deployment_num',	'playlist_title', 'message_title', 'key_points',
    'languagecode',	'variant', 'default_category', 'sdg_goals',	'sdg_targets']
header_deplo = ['project', 'deployment_num', 'startdate', 'enddate', 'component', 'name']

session = create_db_session()

@migration
@validate_keys(['program_code'])
def lambda_handler(event, context):
    # Generate the content.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_content)
    writer.writeheader()

    contents = session.query(Content) \
        .filter(Content.program_code == event['program_code']) \
        .all()

    for content in contents:
        for playlist in content.content:
            for message in playlist['messages']:
                if message['sdg_goal']:
                    goal = session.query(SustainableDevelopmentGoals) \
                        .filter(SustainableDevelopmentGoals.id == message['sdg_goal']) \
                        .first()

                    target = [target for target in goal.targets
                        if target.subsection == message['sdg_target']][0]

                    goal = goal.label
                    target = target.label

                else:
                    goal = ''
                    target = ''

                row = {
                    'deployment_num': content.deployment,
                    'playlist_title': playlist['title'], 'message_title': message['title'],
                    'key_points': message['key_point'], 'languagecode': message['language'],
                    'variant': message['variant'], 'default_category': message['default_category'],
                    'sdg_goals': goal, 'sdg_targets': target
                }

                writer.writerow(row)

    save_to_csv(output.getvalue(), f"{event['program_code']}/content.csv")

    # Generate the deployment_spec.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_deplo)
    writer.writeheader()

    deployments = session.query(Deployment) \
        .filter(Deployment.project == event['program_code']) \
        .all()

    for deployment in deployments:
        rows = [{
            'project': event['program_code'],
            'deployment_num': deployment.deploymentnumber,
            'startdate': deployment.startdate.isoformat(),
            'enddate': deployment.enddate.isoformat(),
            'component': deployment.component,
            'name': f"{event['program_code']}-{str(deployment.startdate.year)[2:]}-{deployment.deploymentnumber}"
        } for message in playlist['messages']]

        writer.writerows(rows)

    save_to_csv(output.getvalue(), f"{event['program_code']}/deployment_spec.csv")

    return {
        'status': 200,
        'message': 'Success'
    }
