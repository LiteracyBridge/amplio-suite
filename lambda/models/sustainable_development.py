from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy_serializer import SerializerMixin

from models.base import Base

class SustainableDevelopmentGoals(Base, SerializerMixin):
    __tablename__ = 'sustainable_development_goals'
    id = Column(Integer, primary_key=True)
    label = Column(String(250), nullable=False)


class SustainableDevelopmentTargets(Base, SerializerMixin):
    __tablename__ = 'sustainable_development_targets'
    id = Column(Integer, primary_key=True)
    parent = Column(Integer, ForeignKey('sustainable_development_goals.id'))
    subsection = Column(Integer, nullable=False)
    label = Column(String(250))
