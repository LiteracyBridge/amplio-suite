import io
import csv
import json

from utils import create_db_session, validate_user_access, \
     save_to_csv, user_programs, UnauthorizedAccess
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist
from models.message import Message


header_content = ['deployment_num',	'playlist_title', 'message_title', 'key_points',
    'languagecode',	'variant', 'default_category', 'sdg_goals',	'sdg_targets']
header_deplo = ['project', 'deployment_num', 'startdate', 'enddate', 'component', 'name']

session = create_db_session()

@validate_keys(['program_code'])
def lambda_handler(event, context):
    email = event['context']['email']

    if event['program_code'] not in user_programs(email): # FIXME: we'd prefer to check with the model rather than the program_code
        raise UnauthorizedAccess()

    # Generate the content.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_content, quoting=csv.QUOTE_NONNUMERIC)
    writer.writeheader()

    playlists = session.query(Playlist) \
        .filter(Playlist.program_code == event['program_code']) \
        .all()
    playlists = [validate_user_access(event, p) for p in playlists]

    for playlist in playlists:
        for message in playlist.messages:
            sdg_goal = ''
            if message.sdg_goal_id:
                sdg_goal = message.sdg_goal.section

            sdg_target = ''
            if message.sdg_target_id:
                sdg_target = f"{sdg_goal}.{message.sdg_target.subsection}"

            category_name = ''
            if message.category:
                category_name = message.category.name

            row = {
                'deployment_num': int(playlist.deployment_id),
                'playlist_title': playlist.title,
                'message_title': message.title,
                'key_points': message.key_point,
                'languagecode': ','.join([lang.code for lang in message.languages]),
                'variant': message.variant,
                'default_category': category_name,
                'sdg_goals': sdg_goal,
                'sdg_targets': sdg_target,
            }

            writer.writerow(row)

    save_to_csv(output.getvalue(), f"{event['program_code']}/content.csv")

    # Generate the deployment_spec.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_deplo)
    writer.writeheader()

    deployments = session.query(Deployment) \
        .filter(Deployment.program_code == event['program_code']) \
        .all()

    rows = [{
        'project': deployment.program_code,
        'deployment_num': deployment.number,
        'startdate': deployment.start_date.isoformat(),
        'enddate': deployment.end_date.isoformat(),
        'component': deployment.component,
        'name': f"{deployment.program_code}-{str(deployment.start_date.year)[2:]}-{deployment.number}"
    } for deployment in deployments]

    writer.writerows(rows)

    save_to_csv(output.getvalue(), f"{event['program_code']}/deployment_spec.csv")

    return {
        'status': 200,
        'message': 'Success'
    }
