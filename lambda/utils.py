import os
import json
import base64

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

if os.getenv('ENV') == 'AWS':
    import boto3
    from botocore.exceptions import ClientError

# Load .env file
load_dotenv()

def get_secret(secret_name, region_name='us-west-2'):
    """
    Read secrets from Secrets Manager

    parameter
    ---------
    secret_name: string
        Screte name
    region_name: string, opt
        Secrets Manager region. By default is 'us-west-2'
    """
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            secret = json.loads(secret)
        else:
            secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return secret

def get_db_url():
    if os.getenv('ENV') == 'AWS':
        config = get_secret('stg/postgres')
        DATABASE_URL = f"postgresql+psycopg2://{config['username']}:{config['password']}@{config['host']}:{config['port']}/ampliosuite"
    else:
        DATABASE_URL = os.getenv('DATABASE_URL')

    return DATABASE_URL

def create_db_session():
    DATABASE_URL = get_db_url()
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)()

    return session

def user_programs(username):
    if os.getenv('ENV') != 'AWS':
        return ['TEST', 'TEST2', 'My Test Program 8']
    
    from amplio.rolemanager import manager
    manager.open_tables()
    program_items = manager.get_programs_for_user(username).items()
    return [program for program, _role in program_items]

class UnauthorizedAccess(Exception):
    pass

def validate_user_access(event, model):
    # FIXME: there must always be a username in prod - we're allowing a passthrough behaviour here until we deploy
    username = None
    if ('context' in event) and ('username' in event['context']):
        username = event['context']['username']
    elif 'email' in event:
        username = event['email']
    else:
        print(f"Didn't get a username - skipping model permission validation...")
        return model
    # Once in prod, just uncomment this next line
    # username = event['context']['username']
    
    if not model:
        return None

    if model.program_code not in user_programs(username):
        raise UnauthorizedAccess()
    
    return model

def save_to_csv(text, file_path):
    # FIXME this must be a env var
    bucket = 'stg-amplio-progspecs'

    client = boto3.client('s3')
    client.put_object(Body=text, Bucket=bucket, Key=file_path)
