import psycopg2

from utils import get_connection_config

# Test db connection
def lambda_handler(event, context):
    try:
        config = get_connection_config()
        connection = psycopg2.connect(config)
        cursor = connection.cursor()
    except psycopg2.Error as error:
        return {
            'error': error
        }

    # PostgreSQL Connection properties
    conn_props = connection.get_dsn_parameters()
    # PostgreSQL version
    cursor.execute('SELECT version();')
    record = cursor.fetchone()

    return {
        'statusCode': 200,
        'connection properties': conn_props,
        'postgres version': record
    }
