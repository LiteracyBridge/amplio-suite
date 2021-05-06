from sqlalchemy.orm import Session

from core import (
    router,
    get_current_user,
    check_user_access,
    Body,
    QueryString,
    NotFoundException,
)
from db import get_db
from programs import schemas
from programs.controller import crud
from projects import (
    schemas as projects_schemas,
    controller as projects_controller,

)


@router()
def create_program(
    program: schemas.ProgramCreate,
    project: projects_schemas.ProjectCreate,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    print(f"DENTRO {project} -- {type(project)}")
    check_user_access(user_email, program)
    project = projects_controller.crud.create_project(
        db=db, obj_in=project
    )
    program = crud.create_program(db=db, obj_in=program)

    return {**program.to_dict(), "name": project.name}

@router()
def get_program(
    program_code: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_code)
    project = projects_controller.crud.get_by_program_code(
        db=db, program_code=program_code
    )
    program = crud.get_by_program_code(
        db=db, program_code=program_code
    )
    if not program:
        return NotFoundException("Program not found")

    return {**program.to_dict(), 'name': project.name}


@router()
def update_program(
    program: schemas.ProgramUpdate,
    project: projects_schemas.ProjectUpdate,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program)
    db_project = projects_controller.crud.get_by_program_code(
        db=db, program_code=project.program_code
    )
    project = projects_controller.crud.update(
        db=db, db_obj=db_project, obj_in=project
    )

    db_program = crud.update_program(db=db, obj_in=program)
    return {**db_program.to_dict(), 'name': db_project.name}
