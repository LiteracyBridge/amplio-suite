from sqlalchemy import Column, String
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel

class Language(BaseModel, SerializerMixin):
    __tablename__ = "supportedlanguages"
    code = Column("languagecode", String, primary_key=True)
    name = Column("languagename", String, nullable=False)
    comments = Column(String)
