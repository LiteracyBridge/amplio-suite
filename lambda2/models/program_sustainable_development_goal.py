from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date, ForeignKey

Base = declarative_base()

class ProgramSustainableDevelopmentGoal(Base):
    __tablename__ = "program_sustainable_development_goals"
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=False, primary_key=True, index=True)
    sustainable_development_goal_id = Column(Integer, ForeignKey('listening_models.id'), nullable=False, primary_key=True, index=True)
