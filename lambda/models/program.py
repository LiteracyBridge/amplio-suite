from datetime import date

from sqlalchemy import Column, Integer, String, Date, JSON
from sqlalchemy.orm import validates
from sqlalchemy.ext.declarative import declarative_base

valid_sdg = [
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
valid_listening_model = ['households', 'groups', 'community_workers', 'place_based']
time_length = ['one_month', 'one_quarter', 'six_months', 'one_year']
time_period = ['weekly', 'bi_weekly', 'monthly', 'quarterly',
               'semi_annually', 'annually', 'not_applicable']

Base = declarative_base()

class Program(Base):
    __tablename__ = "programs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    sustainable_development_goal = Column(JSON, nullable=False)
    listening_model = Column(JSON, nullable=False)
    amount_deployment = Column(Integer, nullable=False)
    deployment_length = Column(String(50), nullable=False)
    first_deployment = Column(Date, nullable=False)
    feedback_frequency = Column(String(50), nullable=False)
    feedback_frequency2 = Column(String(50), nullable=False)

    @validates('sustainable_development_goal')
    def validate_sustainable_development_goal(self, key, goals):
        validate_list_input(goals, valid_sdg, 'goals')
        return goals

    @validates('listening_model')
    def validate_listening_model(self, key, models):
        validate_list_input(models, valid_listening_model, 'listening_model')
        return models

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

def validate_list_input(opts, keys, text):
    """
    Validate if all the elements of the entered list are in the list of valid keys

    parameter
    ---------
    opts: list
        Input list
    keys: list
        Valid keys
    text: string
        Text to add on the error message
    """
    valid_keys = [opt in keys for opt in opts]

    if not all(valid_keys):
        invalid_keys = [opt for i, opt in enumerate(opts) if not valid_keys[i]]
        raise ValueError(f"Invalid {text} {invalid_keys}")
