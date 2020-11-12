from utils import create_db_session, user_programs, UnauthorizedAccess
from decorators import validate_keys
from models.recipient import Recipient

session = create_db_session()

keys = [
    'recipient_id',
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
    program_code = event['program_code']

    email = event['context']['email']

    if program_code not in user_programs(email): # FIXME: we'd prefer to check with the model rather than the program_code
        raise UnauthorizedAccess()

    try:
        session.query(Recipient) \
            .filter(
                Recipient.recipient_id == event['recipient_id'],
                Recipient.program_code == program_code,
            ) \
            .update({
                'community_name': event['community_name'],
                'group_name': event['group_name'],
                'component': event['component'],
                'region': event['region'],
                'district': event['district'],
                'num_households': event['num_households'],
                'num_tbs': event['num_tbs'],
                'support_entity': event['support_entity'],
                'model': event['model'],
                'language': event['language'],
                'agent': event['agent'],
                'variant': event['variant'],
                'group_size': event['group_size'],
                'deployments': event.get('deployments'),
                'agent_gender': event.get('agent_gender'),
                'direct_beneficiaries': event.get('direct_beneficiaries'),
                'direct_beneficiaries_additional': event.get('direct_beneficiaries_additional'),
                'indirect_beneficiaries': event.get('indirect_beneficiaries'),
            })

        session.commit()

        return {
            'status': 202,
            'message': 'Successfully update recipient'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
