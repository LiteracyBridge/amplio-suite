from sqlalchemy.orm import Session

from db import get_db
from core.exceptions import NotFoundException
from core.decorators import check_user_access, format_request_response
from programs.controller import crud
from projects.controller import crud as projects_crud


keys = [
    'program_code',
    'name',
    'country',
    'region',
    'sustainable_development_goals',
    'listening_models',
    'deployments_count',
    'deployments_length',
    'deployments_first',
    'feedback_frequency',
    'languages',
    'partner',
    'affiliate',
]

@get_db()
@check_user_access()
@format_request_response(request_model=keys)
def create_program(event, context, db: Session):
    project_obj = {
        "name": event["name"],
        "program_code": event["program_code"],
    }
    projects_crud.create_project(
        db=db, obj_in=project_obj
    )
    del event["name"]

    return crud.create_program(
        db=db, obj_in=event
    )


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code"])
def get_program(event, context, db: Session):
    project = projects_crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )
    program = crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )
    if not program:
        return NotFoundException("Program not found")

    return {**program.to_dict(), 'name': project.name}


@get_db()
@check_user_access()
@format_request_response(request_model=keys)
def update_program(event, context, db: Session):
    project = projects_crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )
    project = projects_crud.update(
        db=db, db_obj=project, obj_in={"name": event["name"]}
    )
    del event["name"]

    return crud.update_program(db=db, obj_in=event)


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code"])
def next_deployment(event, context, db: Session):
    return crud.create_next_deployment(
        db=db, program_code=event["program_code"]
    )
