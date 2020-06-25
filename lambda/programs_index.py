import os
import sys
sys.path.append('/var/task/package')

from utils import get_db_url
from amplio.rolemanager import manager

from alembic.config import Config
from alembic import command

from dotenv import load_dotenv

# Load .env file
load_dotenv()
alembic_cfg = Config(os.getenv('ALEMBIC_INI'))

manager.open_tables()

def lambda_handler(event, context):
    try:
        command.upgrade(alembic_cfg, 'head')
    except BaseException as err:
        return {
            'status': 503,
            'headers': {'Retry-After': 5},
            'error': str(err)
        }

    """
    List programs by user

    HTTP
    ----
    method: POST
    auth: True
    enpoint:

    Parameters
    ----------
    email: string
    """

    email = event['email']

    program_items = manager.get_programs_for_user(email).items()
    roles = {}
    for program, role in program_items:
        roles[program] = role

    return {
        'status': 200,
        'programs': roles
    }
