import os
from utils import get_db_url
from amplio.rolemanager import manager

manager.open_tables()

def lambda_handler(event, context):
    # FIXME: make Amplio manager work locally
    if os.getenv('ENV') != 'AWS':
        return {
            'status': 200,
            'programs': {
                'TEST': 'AD,PM,CO,FO',
                'TEST2': 'AD,PM,CO,FO',
                'My Test Program 8': 'AD,PM,CO,FO'
            }
        }

    email = event['context']['username']

    program_items = manager.get_programs_for_user(email).items()
    roles = {}
    for program, role in program_items:
        roles[program] = role

    return {
        'status': 200,
        'programs': roles
    }
