# The declarative base has to be shared between all models for the
# relationships between them to work
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
