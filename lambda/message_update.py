from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.deployment import Deployment
from models.playlist import Playlist
from models.message import Message
from models.message_langs import MessageLanguages

session = create_db_session()


@validate_keys(['messages'])
def lambda_handler(event, context):
    for messageIn in event['messages']:
        message = session.query(Message) \
            .filter(
                Message.program_code == messageIn['program_code'],
                Message.id == messageIn['id'],
            ) \
            .first()

        message.position = messageIn['position']
        message.title = messageIn['title']
        message.format = messageIn['format']
        message.default_category_id = messageIn['default_category_id']
        message.variant = messageIn['variant']
        message.sdg_goal_id = messageIn['sdg_goal_id']
        message.sdg_target_id = messageIn['sdg_target_id']
        message.key_point = messageIn['key_point']
        session.flush()

        actual_languages = [language.code for language in message.languages]
        messageIn['languages'] = [language['code'] for language in messageIn['languages']]
        new_codes = [language for language in messageIn['languages'] if language not in actual_languages]
        remove_codes = [language for language in actual_languages if language not in messageIn['languages']]

        langs = [MessageLanguages(
            message_id=messageIn['id'],
            language_code=code,
        ) for code in new_codes]
        session.add_all(langs)
        session.flush()

        session.query(MessageLanguages) \
            .filter(
                MessageLanguages.message_id == messageIn['id'],
                MessageLanguages.language_code.in_(remove_codes),
            ) \
            .delete(synchronize_session='fetch')

    session.commit()

    return {
        'status': 202,
        'message': 'successfully update message'
    }
