from typing import List

from db import BaseSchema


class SustainableDevelopmentsTarget(BaseSchema):
    id: int
    goal_id: int
    subsection: int
    label: str


class SustainableDevelopmentsGoal(BaseSchema):
    id: int
    section: int
    label: str
    img_url: str
    targets: List[SustainableDevelopmentsTarget]
