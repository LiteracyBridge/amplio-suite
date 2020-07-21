import os
import sys
import functools
sys.path.append('/var/task/package')

from utils import get_db_url
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from alembic import command
from alembic.config import Config

# Load .env file
load_dotenv()
alembic_cfg = Config(os.getenv('ALEMBIC_INI'))

DATABASE_URL = get_db_url()
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()


def migration(handler):
    """
    Run the DB migrations
    """
    @functools.wraps(handler)
    def wrapper(event, context):
        try:
            command.upgrade(alembic_cfg, 'head')
        except BaseException as err:
            return {
                'status': 503,
                'headers': {'Retry-After': 5},
                'error': str(err)
            }

        return handler(event, context)

    return wrapper


def validate_keys(keys):
    """
    Validate if all the necessary keys are in the request
    """
    def decorator(handler):
        @functools.wraps(handler)
        def wrapper(event, context):
            for key in keys:
                if key not in event:
                    return {
                        'status': 422,
                        'error': f'{key} must be specified'
                    }

            return handler(event, context)
        return wrapper
    return decorator
