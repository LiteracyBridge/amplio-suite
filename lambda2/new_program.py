import os
import sys
sys.path.append('/var/task/package')

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.program import Program

# Load .env file
load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))
Session = sessionmaker(bind=engine)
session = Session()

# For validate the selectors
time_length = {
    '1 Month': 'one_month',
    '1 Quarter': 'one_quarter',
    'Six months': 'six_months',
    'One year': 'one_year'
}

time_period = {
    'Weekly': 'weekly',
    'Bi-Weekly': 'bi_weekly',
    'Monthly': 'monthly',
    'Quarterly': 'quarterly',
    'Semi-Annually': 'semi_annually',
    'Annually': 'annually',
    'Not Applicable': 'not_applicable'
}

def lambda_handler(event, context):
    """
    Insert new program to the db

    HTTP
    ----
    method: POST
    auth: True
    enpoint:

    Parameters
    ----------
    name: string
        Program name
    amount_deployment: Integer
    """
    # Validate the input keys
    valid_keys = ['name', 'amount_deployment', 'deployment_length',
                  'first_deployment', 'feedback_frequency',
                  'feedback_frequency2']

    for key in valid_keys:
        if key not in event:
            return {
                'status': 402,
                'error': f'{key} must be specified'
            }

    # Validate selectors
    selectors = [
        ['deployment_length', time_length],
        ['feedback_frequency', time_period],
        ['feedback_frequency2', time_period]
    ]

    for (key, opts) in selectors:
        if event[key] not in opts:
            return {
                'status': 402,
                'error': f'Invalid "{key}"'
            }

    for (key, opts) in selectors:
        event[key] = opts[event[key]]

    program = Program(**event)
    # session.add(program)
    # session.commit()

    return {
        'status': 202,
        'message': 'successfully created program',
        'program_id': program.id
    }
