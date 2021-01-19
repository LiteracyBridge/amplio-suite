import random
from string import ascii_lowercase, digits

from utils import create_db_session, validate_user_access
from decorators import validate_keys
from models.program import Program
from models.recipient import Recipient

session = create_db_session()

keys = [
    'program_code',
    'community_name',
    'group_name',
    'component',
    'region',
    'district',
    'num_households',
    'num_tbs',
    'support_entity',
    'model',
    'language',
    'agent',
    'group_size',
]

@validate_keys(keys)
def lambda_handler(event, context):
    recipient_id = ''.join(random.choices(ascii_lowercase + digits, k=16))

    program = session.query(Program) \
        .filter(Program.program_code == event['program_code']) \
        .first()
    
    validate_user_access(event, program)

    try:
        recipient = Recipient(
            recipient_id=recipient_id,
            program_code=event['program_code'],
            partner=program.partner,
            affiliate=program.affiliate,
            country=program.country,
            community_name=event['community_name'],
            group_name=event['group_name'],
            component=event['component'],
            region=event['region'],
            district=event['district'],
            num_households=event['num_households'],
            num_tbs=event['num_tbs'],
            support_entity=event['support_entity'],
            model=event['model'],
            language=event['language'],
            agent=event['agent'],
            coordinates=event.get('coordinates'),
            latitude=event.get('latitude'),
            longitude=event.get('longitude'),
            variant=event.get('variant'),
            group_size=event['group_size'],
            deployments=event.get('deployments'),
            agent_gender=event.get('agent_gender'),
            direct_beneficiaries=event.get('direct_beneficiaries'),
            direct_beneficiaries_additional=event.get('direct_beneficiaries_additional'),
            indirect_beneficiaries=event.get('indirect_beneficiaries'),
        )
    except ValueError as err:
        return {
            'status': 422,
            'error': str(err)
        }

    session.add(recipient)
    session.commit()

    return {
        'status': 202,
        'message': 'successfully created recipient',
        'recipientId': recipient_id
    }
