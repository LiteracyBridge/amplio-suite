from datetime import date

from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import validates
from sqlalchemy.ext.declarative import declarative_base

time_length = ['one_month', 'one_quarter', 'six_months', 'one_year']
time_period = ['weekly', 'bi_weekly', 'monthly', 'quarterly',
               'semi_annually', 'annually', 'not_applicable']

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

    @validates('deployment_length')
    def validate_deployment_length(self, key, deployment_length):
        if deployment_length not in time_length:
            raise ValueError("Invalid 'deployment_length' argument")
        return deployment_length

    @validates('first_deployment')
    def validate_first_deployment(self, key, first_deployment):
        assert date.fromisoformat(first_deployment)
        return first_deployment

    @validates('feedback_frequency')
    def validate_feedback_frequency(self, key, feedback_frequency):
        if feedback_frequency not in time_period:
            raise ValueError("Invalid 'feedback_frequency' argument")
        return feedback_frequency

    @validates('feedback_frequency2')
    def validate_feedback_frequency2(self, key, feedback_frequency2):
        if feedback_frequency2 not in time_period:
            raise ValueError("Invalid 'feedback_frequency2' argument")
        return feedback_frequency2
