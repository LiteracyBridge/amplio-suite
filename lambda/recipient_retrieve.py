import re

from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.recipient import Recipient

session = create_db_session()

def camel_to_snake(name):
    name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()


def contains_text(recipient, text):
    ignore_keys = ['program_code', 'partner', 'recipient_id',
        'deployments', 'direct_beneficiaries_additional']
    search = [True if re.search(text.lower(), str(value), re.I) else False
              for key, value in recipient.items() if key not in ignore_keys]

    return any(search)


@validate_keys(['program_code', 'sort_by', 'sort_descending'])
def lambda_handler(event, context):
    if 'recipient_id' in event:
        recipient = session.query(Recipient) \
            .filter(
                Recipient.program_code == event['program_code'],
                Recipient.recipient_id == event['recipient_id']
            ) \
            .first()

        validate_user_access(event, recipient)

        if recipient:
            return {
                'status': 200,
                'program_code': event['program_code'],
                'recipient': recipient.to_dict()
            }
    else:
        recipients = session.query(Recipient) \
            .filter(Recipient.program_code == event['program_code'])

        recipients = [validate_user_access(event, recipient).to_dict() for recipient in recipients]

        if event['sort_by']:
            col = camel_to_snake(event['sort_by'])
            recipients = sorted(recipients,
                key=lambda recipient: recipient[col],
                reverse=event['sort_descending']
            )

        if event['filter_text']:
            recipients = [recipient for recipient in recipients
                if contains_text(recipient, event['filter_text'])]

        if recipients:
            return {
                'status': 200,
                'program_code': event['program_code'],
                'recipients': recipients
            }

    return {
        'status': 401,
        'error': 'Recipients not found'
    }
