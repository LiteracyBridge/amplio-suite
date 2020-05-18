import os

# DB connection parameters
def get_connection_config():
    dbname = os.environ['POSTGRES_DB']
    user = os.environ['POSTGRES_USER']
    password = os.environ['POSTGRES_PASSWORD']
    host = os.environ['POSTGRES_HOST']
    port = os.environ['POSTGRES_PORT']

    return f'user={user} password={password} dbname={dbname} host={host} port={port}'
