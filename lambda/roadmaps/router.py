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
from roadmaps.controller import crud


@router()
def get_roadmap(
    program_code: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db()
):
    check_user_access(user_email, program_code)
    return crud.get_by_program_code(
        db=db, program_code=program_code
    )


@router()
def update_roadmap(
    program_code: Body,
    complted: Body,
    user_email: str = get_current_user,
    db: Session = get_db(),
):
    check_user_access(user_email, program_code)
    db_roadmap = crud.get_by_program_code(
        db=db, program_code=program_code
    )
    if not db_roadmap:
        return NotFoundException("Roadmap not found")

    return crud.update(
        db=db, db_obj=db_roadmap, obj_in={ "completed": complted }
    )
