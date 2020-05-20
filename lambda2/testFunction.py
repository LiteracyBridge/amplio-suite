import psycopg2

DB_HOST = "amplio-suite.cdgyahcawf4m.us-west-2.rds.amazonaws.com"

# Test db connection
def lambda_handler(event, context):

    return {
        'statusCode': 200,
        'postgres version': psycopg2.__version__
    }
