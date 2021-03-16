from sqlalchemy.orm import Session

from db import get_db
from core.types import LambdaDict, LambdaContext
from core.exceptions import NotFoundException
from core.decorators import check_user_access, format_request_response
from roadmaps.controller import crud


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code"])
def get_roadmap(event: LambdaDict, context: LambdaContext, db: Session):
    return crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code", "completed"])
def update_roadmap(event: LambdaDict, context: LambdaContext, db: Session):
    db_roadmap = crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )
    if not db_roadmap:
        return NotFoundException("Roadmap not found")

    return crud.update(
        db=db, db_obj=db_roadmap, obj_in=event
    )
