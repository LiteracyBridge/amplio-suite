import os
import sys
sys.path.append('/var/task/package')

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base

# Load .env file
load_dotenv()

Base = automap_base()
engine = create_engine(os.getenv('POSTGRES_URL'))

# reflect the tables
Base.prepare(engine, reflect=True)

# mapped classes are now created with names by default
# matching that of the table name.
# Programs = Base.classes.programs
print(Base.classes)

def lambda_handler(event, context):

    print(engine)

    return {
        'status': 200,
        'body': 'Todo bien!'
    }
