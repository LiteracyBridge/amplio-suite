import os
import sys
sys.path.append('/var/task/package')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from utils import get_db_url
from models.program import Program

from alembic.config import Config
from alembic import command

from dotenv import load_dotenv
# Load .env file
load_dotenv()
alembic_cfg = Config(os.getenv('ALEMBIC_INI'))

DATABASE_URL = get_db_url()
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def lambda_handler(event, context):
    try:
        command.upgrade(alembic_cfg, 'head')
    except BaseException as err:
        return {
            'status': 503,
            'headers': {'Retry-After': 5},
            'error': str(err)
        }

    valid_keys = ['program_id']

    for key in valid_keys:
        if key not in event:
            return {
                'status': 422,
                'error': f'{key} must be specified'
            }

    try:
        program = Program.query.get(program_id)
    except ValueError as err:
        return {
            'status': 404,
            'error': str(err)
        }
    return {
        'status': 200,
        'program': program
    }
