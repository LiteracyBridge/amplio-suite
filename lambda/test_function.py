import os
import sys
sys.path.append('./package')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from utils import get_db_url

DATABASE_URL = get_db_url()
engine = create_engine(DATABASE_URL)

# Test db connection
def lambda_handler(event, context):
    print(DATABASE_URL)
    print(engine)

    engine.connect()

    return {
        'statusCode': 200,
        'postgres version': psycopg2.__version__
    }
