from typing import List

from db import BaseSchema


class ProgramBase(BaseSchema):
    program_code: str
    country: str
    region: List[str]
    sustainable_development_goals: List[int]
    listening_models: List[int]
    deployments_count:int
    deployments_length: str
    deployments_first: str
    feedback_frequency: str
    languages: List[str]
    partner: str
    affiliate: str


class ProgramCreate(ProgramBase):
    pass


class ProgramUpdate(ProgramBase):
    pass


class Program(ProgramBase):
    id: int
