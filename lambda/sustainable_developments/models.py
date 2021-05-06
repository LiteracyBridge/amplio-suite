from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel


class SustainableDevelopmentGoals(BaseModel, SerializerMixin):
    __tablename__ = 'sustainable_development_goals'
    id = Column(Integer, primary_key=True)
    section = Column(Integer, nullable=False, unique=True)
    label = Column(String(250), nullable=False)
    img_url = Column(String(250), nullable=False)

    targets = relationship('SustainableDevelopmentTargets')


class SustainableDevelopmentTargets(BaseModel, SerializerMixin):
    __tablename__ = 'sustainable_development_targets'
    __table_args__ = (
        UniqueConstraint('goal_id', 'subsection', name='sdg_targets_uniqueness_key'),
    )

    id = Column(Integer, primary_key=True)
    goal_id = Column(Integer, ForeignKey('sustainable_development_goals.id'))
    subsection = Column(Integer, nullable=False)
    label = Column(String(250))
