from enum import Enum
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

from sqlalchemy import Column, Integer, String, Date, JSON, UniqueConstraint, ForeignKey
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin

from models.deployment import Deployment
from models.base import Base


time_length = ['one_month', 'one_quarter', 'six_months', 'one_year']
time_period = ['weekly', 'bi_weekly', 'monthly', 'quarterly',
               'semi_annually', 'annually', 'not_applicable']

beneficiaries_map = {
    'male': 'Number Male',
    'female': 'Number Female',
    'youth': 'Number Youth'
}

class DeploymentFreq(Enum):
    one_month = 1
    one_quarter = 3
    six_months = 6
    one_year = 12

class Program(Base, SerializerMixin):
    __tablename__ = "programs"
    __table_args__ = (
        UniqueConstraint('projectcode', name='programs_uniqueness_key'),
    )
    id = Column(Integer, primary_key=True, index=True)
    projectcode = Column(ForeignKey('projects.projectcode'), index=True, nullable=False)
    country = Column(String(50), nullable=False)
    region = Column(JSON, nullable=False)
    sustainable_development_goals = Column(JSON, nullable=False)
    listening_models = Column(JSON, nullable=False)
    deployments_count = Column(Integer, nullable=False)
    deployments_length = Column(String(50), nullable=False)
    deployments_first = Column(Date, nullable=False)
    feedback_frequency = Column(String(50), nullable=False)
    feedback_frequency_other = Column(String(50), nullable=False)
    languages = Column(JSON, nullable=False)
    direct_beneficiaries_map = Column(JSON, default=beneficiaries_map)
    direct_beneficiaries_additional_map = Column(JSON, default={})
    partner = Column(String, nullable=False)
    affiliate = Column(String, nullable=False)

    @validates('deployments_length')
    def validate_deployments_length(self, key, deployments_length):
        if deployments_length not in time_length:
            raise ValueError("Invalid 'deployments_length' argument")
        return deployments_length

    @validates('deployments_first')
    def validate_deployments_first(self, key, deployments_first):
        assert date.fromisoformat(deployments_first)
        return deployments_first

    @validates('feedback_frequency')
    def validate_feedback_frequency(self, key, feedback_frequency):
        if feedback_frequency not in time_period:
            raise ValueError("Invalid 'feedback_frequency' argument")
        return feedback_frequency

    @validates('feedback_frequency_other')
    def validate_feedback_frequency_other(self, key, feedback_frequency_other):
        if feedback_frequency_other not in time_period:
            raise ValueError("Invalid 'feedback_frequency_other' argument")
        return feedback_frequency_other

    def default_deployments(self):
        deployments = []
        increment = DeploymentFreq[self.deployments_length].value
        initial_date = datetime.strptime(self.deployments_first, '%Y-%m-%d')

        for i in range(1, self.deployments_count + 1):
            start_date = initial_date + relativedelta(months=increment * (i - 1))
            end_date = initial_date + relativedelta(months=increment * i)

            data = {
                'project': self.projectcode,
                'deployment': str(i),
                'deploymentname': str(i),
                'deploymentnumber': i,
                'startdate': start_date,
                'enddate': end_date,
                'component': ''
            }

            deployments.append(Deployment(**data))

        return deployments

    def next_deployments(self):
        increment = DeploymentFreq[self.deployments_length].value

        start_date = self.deployments_first + relativedelta(months=increment * self.deployments_count)
        end_date = self.deployments_first + relativedelta(months=increment * (self.deployments_count + 1))

        data = {
            'project': self.projectcode,
            'deployment': str(self.deployments_count + 1),
            'deploymentname': str(self.deployments_count + 1),
            'deploymentnumber': self.deployments_count + 1,
            'startdate': start_date,
            'enddate': end_date,
            'component': ''
        }

        return Deployment(**data)
    
    def program_code(self):
        return self.projectcode


# should validate_list_input belong to a utils package of some sort?
def validate_list_input(opts, keys, text):
    valid_keys = [opt in keys for opt in opts]

    if not all(valid_keys):
        invalid_keys = [opt for i, opt in enumerate(opts) if not valid_keys[i]]
        raise ValueError(f"Invalid {text} {invalid_keys}")
