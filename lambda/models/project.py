from sqlalchemy import Column, Integer, String, Boolean, UniqueConstraint
from sqlalchemy.orm import validates
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        UniqueConstraint('projectcode', name='projects_uniqueness_key'),
    )
    id = Column(Integer)
    projectcode = Column(String(255), primary_key=True, index=True, nullable=False)
    project = Column(String(255), nullable=False)
    active = Column(Boolean)


    def __getstate__(self):
        state = self.__dict__.copy()
        del state['_sa_instance_state']
        return state
