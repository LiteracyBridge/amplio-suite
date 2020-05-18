import psycopg2

from utils import get_connection_config


def lambda_handler(event, context):
    # Connect with the db
    config = get_connection_config()
    connection = psycopg2.connect(config)
    cursor = connection.cursor()

    # Insert program
    vars = (event['name'], event['amount_deployment'],
            event['deployment_length'], event['first_deployment'],
            event['feedback_frequency'], event['feedback_frequency2'])

    query = """
    INSERT INTO programs(name, amount_deployment, deployment_length, first_deployment,
                         feedback_frequency, feedback_frequency2)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """

    cursor.execute(query, vars)
    program_id = cursor.fetchone()[0]
    print(program_id)

    # Insert listening model
    vars = [(program_id, model) for model in event['listening_model']]
    query = """
    INSERT INTO program_listening_model(program_id, name)
        VALUES (%s, %s)
    """
    cursor.executemany(query, vars)

    connection.commit()

    return {
        'statusCode': 200,
        'message': 'program created successfully'
    }
