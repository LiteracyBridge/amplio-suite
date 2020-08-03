import io
import csv

from utils import create_db_session, save_file_s3
from decorators import migration, validate_keys
from models.content import Content

header = ['deployment_num',	'playlist_title', 'message_title', 'key_points',
    'languagecode',	'variant', 'default_category', 'sdg_goals',	'sdg_targets']

session = create_db_session()

@migration
@validate_keys(['program_code'])
def lambda_handler(event, context):
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header)
    writer.writeheader()

    contents = session.query(Content) \
        .filter(Content.program_code == event['program_code']) \
        .all()

    for content in contents:
        for playlist in content.content:
            rows = [{
                'playlist_title': playlist['title'], 'message_title': message['title'],
                'key_points': message['key_point'], 'languagecode': message['language'],
                'variant': message['variant'], 'default_category': message['default_category'],
                'sdg_goals': message['sdg_goal'], 'sdg_targets': message['sdg_target']
            } for message in playlist['messages']]

            writer.writerows(rows)

    save_file_s3(output, 'content.csv')

    return {
        'status': 200,
        'csv': output.getvalue()
    }
