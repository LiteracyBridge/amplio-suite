from db import BaseSchema


class ProjectBase(BaseSchema):
    name: str
    program_id: str

class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class Project(ProjectBase):
    id: int
    active: bool
