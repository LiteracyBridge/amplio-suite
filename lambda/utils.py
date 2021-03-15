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
        config = get_secret('Suite.Lambda')
        DATABASE_URL = f"postgresql+psycopg2://{config['username']}:{config['password']}@{config['host']}:{config['port']}/{config['suite_dbname']}"
    else:
        DATABASE_URL = os.getenv('DATABASE_URL')

    return DATABASE_URL

def create_db_session():
    DATABASE_URL = get_db_url()
    engine = create_engine(DATABASE_URL)
    session = sessionmaker(bind=engine)()

    return session

class TableManager(object):
    _instance = None

    @classmethod
    def get_instance(cls):
        if not cls._instance:
            from amplio.rolemanager import manager
            manager.open_tables()
            cls._instance = manager
        return cls._instance

def user_programs(email):
    if os.getenv('ENV') != 'AWS':
        return ['TEST', 'TEST2', 'My Test Program 8']

    program_items = TableManager.get_instance().get_programs_for_user(email).items()
    return [program for program, _role in program_items]


def save_to_csv(text, file_path):
    bucket_info = get_secret('Suite.Lambda')
    if not bucket_info or "deploy_s3_bucket" not in bucket_info:
        raise Exception('You must create a "Suite.Lambda" secret in AWS Secrets Manager with a "deploy_s3_bucket" key for the CSV exports to work')
    
    bucket = bucket_info['deploy_s3_bucket']

    client = boto3.client('s3')
    client.put_object(Body=text, Bucket=bucket, Key=file_path)
