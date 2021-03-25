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
from messages.controller import crud
from programs.controller import crud as programs_crud
from playlists.controller import crud as playlist_crud
from deployments.models import Deployment


@router()
def create_message(
    program_code: Body,
    playlist_id: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_code)
    program = programs_crud.get_by_program_code(
        db=db, program_code=program_code
    )
    playlist = playlist_crud.get(db=db, id=playlist_id)
    if not playlist:
        raise NotFoundException(message="Playlist not found")

    message = {
        "program_code": playlist.program_code,
        "playlist_id": playlist.id,
    }
    return crud.create_message(
        db=db, obj_in=message, languages_codes=program.languages
    )


@router()
def delete_message(
    program_code: QueryString,
    message_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_code)
    return crud.remove_by_id_and_code(
        db=db,
        id=message_id,
        program_code=program_code,
    )


@router()
def update_multi_messages(
    program_code: Body,
    messages: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    results = []

    for message in messages:
        db_message = crud.get(db=db, id=message["id"])
        if not message:
            continue

        message_updated = crud.update_message(
            db=db, db_obj=db_message, obj_in=message
        )
        results.append(message_updated)

    return results
