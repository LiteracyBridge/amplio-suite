from utils import create_db_session
from decorators import migration, validate_keys
from models.project import Project
from models.program import Program


keys = ['programCode', 'name', 'sdg_goals', 'listening_models',
        'deployments_length', 'deployments_count', 'deployments_first',
        'feedback_frequency', 'feedback_frequency_other', 'languages']

session = create_db_session()

@migration
@validate_keys(keys)
def lambda_handler(event, context):
    try:
        session.query(Project) \
            .filter(Project.projectcode == event['programCode']) \
            .update({ 'project': event['name']})
        session.flush()

        session.query(Program) \
            .filter(Program.projectcode == event['programCode']) \
            .update({
                'country': event['country'],
                'region': event['region'],
                'sustainable_development_goals': event['sdg_goals'],
                'listening_models': event['listening_models'],
                'deployments_count': event['deployments_count'],
                'deployments_length': event['deployments_length'],
                'deployments_first': event['deployments_first'],
                'feedback_frequency': event['feedback_frequency'],
                'feedback_frequency_other': event['feedback_frequency_other'],
                'languages': event['languages'],
                'direct_beneficiaries_map': event.get('direct_beneficiaries_map'),
                'direct_beneficiaries_additional_map': event.get('direct_beneficiaries_additional_map'),
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
