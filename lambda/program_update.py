from utils import create_db_session, user_programs, UnauthorizedAccess
from decorators import validate_keys
from models.project import Project
from models.program import Program
from models.recipient import Recipient


keys = [
    'programCode',
    'name',
    'sdg_goals',
    'listening_models',
    'deployments_count',
    'deployments_length',
    'deployments_first',
    'feedback_frequency',
    'languages',
    'partner',
    'affiliate',
    'country',
    'region',
]

session = create_db_session()

@validate_keys(keys)
def lambda_handler(event, context):
    program_code = event['programCode']

    email = event['context']['email']

    if program_code not in user_programs(email): # FIXME: we'd prefer to check with the model rather than the program_code
        raise UnauthorizedAccess()

    try:
        session.query(Project) \
            .filter(Project.program_code == event['programCode']) \
            .update({ 'project': event['name']})
        session.flush()

        session.query(Program) \
            .filter(Program.program_code == event['programCode']) \
            .update({
                'country': event['country'],
                'region': event['region'],
                'sustainable_development_goals': event['sdg_goals'],
                'listening_models': event['listening_models'],
                'deployments_count': event['deployments_count'],
                'deployments_length': event['deployments_length'],
                'deployments_first': event['deployments_first'],
                'feedback_frequency': event['feedback_frequency'],
                'languages': event['languages'],
                'partner': event['partner'],
                'affiliate': event['affiliate'],
                'direct_beneficiaries_map': event.get('direct_beneficiaries_map'),
                'direct_beneficiaries_additional_map': event.get('direct_beneficiaries_additional_map'),
            })
        session.flush()

        session.query(Recipient) \
            .filter(Recipient.program_code == event['programCode']) \
            .update({
                'country': event['country'],
                'partner': event['partner'],
                'affiliate': event['affiliate'],
            })

        session.commit()

        return {
            'status': 202,
            'message': 'successfully update program'
        }
    except BaseException as err:
        return {
            'status': 422,
            'error': str(err)
        }
