import os

from dotenv import load_dotenv
from alembic.config import Config
from alembic import command
from pathlib import Path

# Load .env file (optionally from the AWS Lambda layer)
dotenv_path = Path('/opt/python/.env')
if dotenv_path:
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()
alembic_cfg = Config(os.getenv('ALEMBIC_INI'))

def lambda_handler(event, context):
    """
    Run db migrations using alembic

    HTTP
    ----
    method: POST
    auth: True
    enpoint:

    Parameters
    ----------
    operation: string
        Must be 'upgrade' or 'downgrade'
    version: string, opt
        Next version. By default is 'head' for upgrade and '-1' to downgrade
    """
    if ('operation' in event and event['operation'] == 'downgrade'):
        # Downgrade the db
        if ('version' in event):
            version = event['version']
        else:
            version = '-1'

        command.downgrade(alembic_cfg, version)
    else:
        # Upgrade the db
        if ('version' in event):
            version = event['version']
        else:
            version = 'head'

        command.upgrade(alembic_cfg, version)

    return {
        'status': 200,
        'body': 'Migrations done'
    }
