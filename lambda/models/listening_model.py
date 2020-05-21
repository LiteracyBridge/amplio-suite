from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date

Base = declarative_base()

class ListeningModel(Base):
    __tablename__ = "listening_models"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
