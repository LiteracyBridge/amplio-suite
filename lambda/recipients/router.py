import random
from string import ascii_lowercase, digits

from sqlalchemy.orm import Session

from db import get_db
from core.types import LambdaDict, LambdaContext
from core.exceptions import NotFoundException
from core.decorators import check_user_access, format_request_response
from recipients.controller import crud
from programs.controller import crud as program_crud


keys = [
    'program_code',
    'community_name',
    'group_name',
    'component',
    'region',
    'district',
    'num_households',
    'num_tbs',
    'support_entity',
    'model',
    'language',
    'agent',
    'group_size',
]


@get_db()
@check_user_access()
@format_request_response(request_model=keys)
def create_recipient(event: LambdaDict, context: LambdaContext, db: Session):
    del event["recipient_id"]
    recipient_id = ''.join(random.choices(ascii_lowercase + digits, k=16))

    program = program_crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )

    recipient = {
        "id": recipient_id,
        "partner": program.partner,
        "affiliate": program.affiliate,
        "country": program.country,
        **event
    }

    return crud.create(db=db, obj_in=recipient)


@get_db()
@check_user_access()
@format_request_response(request_model=["recipient_id"])
def get_recipient(event: LambdaDict, context: LambdaContext, db: Session):
    return crud.get(db=db, id=event["recipient_id"])


@get_db()
@check_user_access()
@format_request_response(request_model=["recipient_id", *keys])
def update_recipient(event: LambdaDict, context: LambdaContext, db: Session):
    recipient = crud.get(db=db, id=event["recipient_id"])
    if not recipient:
        return NotFoundException("Recipient not found")

    del event["recipient_id"]
    del event["program_code"]

    return crud.update(db=db, db_obj=recipient, obj_in=event)


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code", "recipient_id"])
def delete_recipient(event: LambdaDict, context: LambdaContext, db: Session):
    recipient = crud.get(db=db, id=event["recipient_id"])
    if not recipient:
        return NotFoundException("Recipient not found")

    return crud.remove(db=db, id=event["recipient_id"])


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code"])
def get_recipients_by_program(event: LambdaDict, context: LambdaContext, db: Session):
    return crud.get_multi_by_program_code(
        db=db, program_code=event["program_code"]
    )
