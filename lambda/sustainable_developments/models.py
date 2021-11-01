from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel


class SustainableDevelopmentGoals(BaseModel, SerializerMixin):
    __tablename__ = 'sdg_goals'
    sdg_goal_id = Column(Integer, primary_key=True)
    # section = Column(Integer, nullable=False, unique=True)
    label = Column(String(250), nullable=False)
    img_url = Column(String(250), nullable=False)

    targets = relationship('SustainableDevelopmentTargets')


class SustainableDevelopmentTargets(BaseModel, SerializerMixin):
    __tablename__ = 'sdg_targets'
    __table_args__ = (
        UniqueConstraint('sdg_goal_id', 'sdg_target', name='sdg_targets_uniqueness_key'),
    )

    sdg_target_id = Column(String(16), primary_key=True)
    sdg_goal_id = Column(Integer, ForeignKey('sdg_goals.sdg_goal_id'))
    sdg_target = Column(Integer, nullable=False)
    label = Column(String(250))
