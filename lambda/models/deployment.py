from sqlalchemy import Column, Integer, String, Date, UniqueConstraint
from sqlalchemy.orm import validates
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Deployment(Base):
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
