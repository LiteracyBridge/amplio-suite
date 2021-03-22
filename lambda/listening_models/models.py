from sqlalchemy import Column, Integer, String
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel


class ListeningModel(BaseModel, SerializerMixin):
    __tablename__ = 'listening_models'
    id = Column(Integer, primary_key=True)
    label = Column(String(250), nullable=False)
    img_url = Column(String(250), nullable=False)
