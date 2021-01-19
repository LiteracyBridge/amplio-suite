from sqlalchemy import Column, Integer, String, Boolean, UniqueConstraint
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin

from models.base import Base

class Project(Base, SerializerMixin):
    __tablename__ = "projects"
    __table_args__ = (
        UniqueConstraint('projectcode', name='projects_uniqueness_key'),
    )
    id = Column(Integer)
    program_code = Column('projectcode', String(255), primary_key=True, index=True, nullable=False)
    name = Column('project', String(255), nullable=False)
    active = Column(Boolean)
