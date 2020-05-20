import os
import sys
sys.path.append('/var/task/package')

from dotenv import load_dotenv
from alembic.config import Config
from alembic import command

# Load .env file
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
    # Validate input
    if (not 'operation' in event):
        return {
            'status': 402,
            'error': 'Operation must be specified'
        }

    if (event['operation'] not in ['upgrade', 'downgrade']):
        return {
            'status': 402,
            'error': f'invalid operation `{event["operation"]}`'
        }

    # Upgrade the db
    if (event['operation'] == 'upgrade'):
        if ('version' in event):
            version = event['version']
        else:
            version = 'head'

        command.upgrade(alembic_cfg, version)

    # Downgrade the db
    if (event['operation'] == 'downgrade'):
        if ('version' in event):
            version = event['version']
        else:
            version = '-1'

        command.downgrade(alembic_cfg, version)

    return {
        'status': 200,
        'body': 'DB migrations done!'
    }
