from sqlalchemy import Column, Integer, String, Boolean, UniqueConstraint
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel

class Project(BaseModel, SerializerMixin):
    __tablename__ = "projects"
    # Note that we're not yet changing the name of the "projectcode" column in the projects table.
    __table_args__ = (
        UniqueConstraint('projectcode', name='projects_uniqueness_key'),
    )
    id = Column(Integer)
    program_id = Column('projectcode', String(255), primary_key=True, index=True, nullable=False)
    name = Column('project', String(255), nullable=False)
    active = Column(Boolean)
