import os
import sys
sys.path.append('./package')

# import sqlalchemy as sa
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

from utils import get_db_url

DATABASE_URL = get_db_url()
# DATABASE_URL="postgresql+psycopg2://amplio:fooFaBar@db:5432"
engine = create_engine(DATABASE_URL)
session = sessionmaker(bind=engine)()

# Test db connection
def lambda_handler(event, context):
    # print(engine)
    # engine.connect()

    # conn = engine.connect()
    # conn.connection.connection.set_isolation_level(0)
    # conn.execute('create database amplio_suite')
    # conn.close()
    # conn.connection.connection.set_isolation_level(1)

    # session.connection().connection.set_isolation_level(0)
    # session.execute('CREATE DATABASE ampliosuite')
    # session.connection().connection.set_isolation_level(1)

    insp = inspect(engine)
    db_list = insp.get_schema_names()
    tables = engine.table_names()
    print(db_list, tables)

    # conn = engine.connect()
    # q = conn.execute('SHOW DATABASES')
    # available_tables = q.fetchall()
    # print(available_tables)

    return {
        'statusCode': 200
        # 'sqlalchemy version': sqlalchemy.__version__
    }
