from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date

Base = declarative_base()

class Program(Base):
    __tablename__ = "programs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    amount_deployment = Column(Integer, nullable=False)
    deployment_length = Column(String(50), nullable=False)
    first_deployment = Column(Date, nullable=False)
    feedback_frequency = Column(String(50), nullable=False)
    feedback_frequency2 = Column(String(50), nullable=False)
