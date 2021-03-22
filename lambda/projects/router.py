from sqlalchemy.orm import Session

from core import (
    router,
    get_current_user,
    check_user_access,
    QueryString,
)
from db import get_db
from utils import TableManager
from core.config import settings, Environment
from projects import schemas
from projects.controller import crud


@router()
def create_project(
    project: schemas.ProjectCreate,
    user_email: str = get_current_user,
    db: Session = get_db(),
):
    check_user_access(user_email, project)
    return crud.create(db=db, obj_in=project)


@router()
def get_project(
    program_code: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db(),
):
    check_user_access(user_email, program_code)
    return crud.get_by_program_code(
        db=db, program_code=program_code
    )


@router()
def get_projects_by_user(user_email: str = get_current_user):
    if settings.ENVIRONMENT == Environment.DEVELOPMENT:
        return {
            'TEST': 'AD,PM,CO,FO',
            'TEST2': 'AD,PM,CO,FO',
            'My Test Program 8': 'AD,PM,CO,FO'
        }

    manager = TableManager.get_instance()
    program_items = manager.get_programs_for_user(user_email).items()
    roles = {}
    for program, role in program_items:
        roles[program] = role

    return roles
