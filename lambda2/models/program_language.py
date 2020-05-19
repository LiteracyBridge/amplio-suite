from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date, ForeignKey

Base = declarative_base()

class ProgramLanguage(Base):
    __tablename__ = "program_languages"
    id = Column(Integer, nullable=False, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=False, index=True)
    name = Column(String(255), nullable=False)
