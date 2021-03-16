from sqlalchemy.orm import Session

from db import get_db
from utils import TableManager
from core.types import LambdaDict, LambdaContext
from core.decorators import check_user_access, format_request_response
from core.config import settings, Environment
from projects.controller import crud


@get_db()
@check_user_access()
@format_request_response(request_model=["name", "program_code"])
def create_project(event: LambdaDict, context: LambdaContext, db):
    obj_in = {
        "program_code": event["program_code"],
        "name": event["name"],
    }
    return crud.create(db=db, obj_in=obj_in)


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code"])
def get_project(event: LambdaDict, context: LambdaContext, db: Session):
    return crud.get_by_program_code(db=db, program_code=event["program_code"])


def get_projects_by_user(event, context):
    if settings.ENVIRONMENT == Environment.DEVELOPMENT:
        return {
            'TEST': 'AD,PM,CO,FO',
            'TEST2': 'AD,PM,CO,FO',
            'My Test Program 8': 'AD,PM,CO,FO'
        }

    email = event['context']['email']

    manager = TableManager.get_instance()
    program_items = manager.get_programs_for_user(email).items()
    roles = {}
    for program, role in program_items:
        roles[program] = role

    return roles
