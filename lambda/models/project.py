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
    projectcode = Column(String(255), primary_key=True, index=True, nullable=False)
    project = Column(String(255), nullable=False)
    active = Column(Boolean)
    
    @property
    def program_code(self):
        return self.projectcode
