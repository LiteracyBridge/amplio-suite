from enum import Enum
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

from sqlalchemy import Column, Integer, String, Date, JSON, UniqueConstraint, ForeignKey
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin

from models.deployment import Deployment
from models.base import Base

valid_sdgs = [
    'no_poverty', 'zero_hunger', 'good_health_and_well _being',
    'quality_education', 'gender_equality', 'clean_water_and_sanitation',
    'affordable_and_clean_energy', 'decent_work_and_economic_growth',
    'industry, innovation_and_infrastructure', 'reduced_inequalities',
    'sustainable_cities_and_communities',
    'responsible_consumption_and_production',
    'climate_action', 'life_below_water', 'life_on_land',
    'peace, justice_and_strong_institutions',
    'parternship_for_the_goals'
]
valid_listening_models = ['households', 'groups', 'community_workers', 'place_based']
time_length = ['one_month', 'one_quarter', 'six_months', 'one_year']
time_period = ['weekly', 'bi_weekly', 'monthly', 'quarterly',
               'semi_annually', 'annually', 'not_applicable']

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
    name = Column(String(255), nullable=False)
    sustainable_development_goals = Column(JSON, nullable=False)
    listening_models = Column(JSON, nullable=False)
    deployments_amount = Column(Integer, nullable=False)
    deployments_length = Column(String(50), nullable=False)
    deployments_first = Column(Date, nullable=False)
    feedback_frequency = Column(String(50), nullable=False)
    feedback_frequency_other = Column(String(50), nullable=False)
    languages = Column(JSON, nullable=False)

    @validates('sustainable_development_goals')
    def validate_sustainable_development_goals(self, key, goals):
        validate_list_input(goals, valid_sdgs, 'goals')
        return goals

    @validates('listening_models')
    def validate_listening_models(self, key, models):
        validate_list_input(models, valid_listening_models, 'listening_models')
        return models

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

        for i in range(1, self.deployments_amount + 1):
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

        start_date = self.deployments_first + relativedelta(months=increment * self.deployments_amount)
        end_date = self.deployments_first + relativedelta(months=increment * (self.deployments_amount + 1))

        data = {
            'project': self.projectcode,
            'deployment': str(self.deployments_amount + 1),
            'deploymentname': str(self.deployments_amount + 1),
            'deploymentnumber': self.deployments_amount + 1,
            'startdate': start_date,
            'enddate': end_date,
            'component': ''
        }

        return Deployment(**data)


# should validate_list_input belong to a utils package of some sort?
def validate_list_input(opts, keys, text):
    valid_keys = [opt in keys for opt in opts]

    if not all(valid_keys):
        invalid_keys = [opt for i, opt in enumerate(opts) if not valid_keys[i]]
        raise ValueError(f"Invalid {text} {invalid_keys}")
