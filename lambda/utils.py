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

def save_file_s3(data, file_name, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # FIXME dont have this var harcord
    bucket = os.getenv('S3_BUCKET_NAME')

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        s3_client.upload_fileobj(data, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True
