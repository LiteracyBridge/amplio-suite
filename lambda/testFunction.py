import os
import sys
sys.path.append('./package')

import psycopg2

from utils import get_db_url

# Test db connection
def lambda_handler(event, context):
    DATABASE_URL = get_db_url()
    print(DATABASE_URL)

    return {
        'statusCode': 200,
        'postgres version': psycopg2.__version__
    }
