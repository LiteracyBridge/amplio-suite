import random
from string import ascii_lowercase, digits

from sqlalchemy.orm import Session

from db import get_db
from core import (
    router,
    get_current_user,
    check_user_access,
    Body,
    QueryString,
    NotFoundException,
)
from recipients import schemas
from recipients.controller import crud
from programs.controller import crud as program_crud



@router()
def create_recipient(
    recipient: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, recipient)
    recipient_id = ''.join(random.choices(ascii_lowercase + digits, k=16))

    program = program_crud.get_by_program_id(
        db=db, program_id=recipient["program_id"]
    )

    del recipient["recipient_id"]

    recipient = {
        "id": recipient_id,
        # "partner": program.partner,
        # "affiliate": program.affiliate,
        "country": program.country,
        **recipient,
    }

    return crud.create(db=db, obj_in=recipient)


@router()
def get_recipient(
    program_id: QueryString,
    recipient_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    return crud.get(db=db, id=recipient_id)


@router()
def update_recipient(
    recipient: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, recipient)
    db_recipient = crud.get(db=db, id=recipient["recipient_id"])
    if not recipient:
        return NotFoundException("Recipient not found")

    return crud.update(db=db, db_obj=db_recipient, obj_in=recipient)


@router()
def delete_recipient(
    program_id: QueryString,
    recipient_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    recipient = crud.get(db=db, id=recipient_id)
    check_user_access(user_email, recipient)
    if not recipient:
        return NotFoundException("Recipient not found")

    return crud.remove(db=db, id=recipient_id)


@router()
def get_recipients_by_program(
    program_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    return crud.get_multi_by_program_id(
        db=db, program_id=program_id
    )
