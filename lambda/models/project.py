from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import validates
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer)
    projectcode = Column(String(255), primary_key=True, index=True, nullable=False)
    project = Column(String(255), nullable=False)
    active = Column(Boolean)
