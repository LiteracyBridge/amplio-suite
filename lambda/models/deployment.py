from sqlalchemy import Column, Integer, String, Date, UniqueConstraint
from sqlalchemy.orm import validates, relationship
from sqlalchemy_serializer import SerializerMixin

from models.base import Base

class Deployment(Base, SerializerMixin):
    __tablename__ = "deployments"
    __table_args__ = (
        UniqueConstraint('project', 'deployment', name='deployments_uniqueness_key'),
    )
    project = Column(String(255), primary_key=True)
    deployment = Column(String(255), primary_key=True)
    deploymentname = Column(String(255))
    deploymentnumber = Column(Integer)
    startdate = Column(Date)
    enddate = Column(Date)
    distribution = Column(String(255))
    comment = Column(String)
    component = Column(String, nullable=False)

    content = relationship('Content', cascade='all, delete')
