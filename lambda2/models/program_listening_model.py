from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date, ForeignKey

Base = declarative_base()

class ProgramListeningModel(Base):
    __tablename__ = "program_listening_models"
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=False, primary_key=True, index=True)
    listening_model_id = Column(Integer, ForeignKey('listening_models.id'), nullable=False, primary_key=True, index=True)
