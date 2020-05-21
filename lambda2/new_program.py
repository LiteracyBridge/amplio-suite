import os
import sys
sys.path.append('/var/task/package')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from utils import get_db_url
from models.program import Program

DATABASE_URL = get_db_url()
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

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

    try:
        program = Program(**event)
    except ValueError as err:
        return {
            'status': 402,
            'error': str(err)
        }

    session.add(program)
    session.commit()

    return {
        'status': 202,
        'message': 'successfully created program',
        'program_id': program.id
    }
