from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist
from models.message import Message
from models.message_langs import MessageLanguages

session = create_db_session()


@validate_keys(['messages'])
def lambda_handler(event, context):
    for message in event['messages']:
        session.query(Message) \
            .filter(
                Message.program_code == message['program_code'],
                Message.id == message['id'],
            ) \
            .update({
                'position': message['position'],
                'title': message['title'],
                'format': message['format'],
                'default_category_id': message['default_category_id'],
                'variant': message['variant'],
                'sdg_goal_id': message['sdg_goal_id'],
                'sdg_target_id': message['sdg_target_id'],
                'key_point': message['key_point'],
            })

        message_langs = session.query(MessageLanguages) \
            .filter(MessageLanguages.message_id == message['id']) \
            .all()
        message_langs = [lang.language_code for lang in message_langs]

        message['languages'] = [lang['code'] for lang in message['languages']]
        new_codes = [lang for lang in message['languages'] if lang not in message_langs]
        remove_codes = [lang for lang in message_langs if lang not in message['languages']]

        langs = [MessageLanguages(
            message_id=message['id'],
            language_code=code,
        ) for code in new_codes]
        session.add_all(langs)
        session.flush()

        for code in remove_codes:
            session.query(MessageLanguages) \
                .filter(
                    MessageLanguages.message_id == message['id'],
                    MessageLanguages.language_code == code,
                ) \
                .delete()

    session.commit()

    return {
        'status': 202,
        'message': 'successfully update message'
    }
