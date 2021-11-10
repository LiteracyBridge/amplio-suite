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
from sqlalchemy import create_engine, text
from programs.controller import crud as programs_crud
from playlists.controller import crud as playlist_crud
from deployments.models import Deployment
from utils import get_db_url


@router()
def create_message(
    program_id: Body,
    playlist_id: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    program = programs_crud.get_by_program_id(
        db=db, program_id=program_id
    )
    playlist = playlist_crud.get(db=db, id=playlist_id)
    if not playlist:
        raise NotFoundException(message="Playlist not found")

    message = {
        "program_id": playlist.program_id,
        "playlist_id": playlist.id,
    }
    return crud.create_message(
        db=db, obj_in=message, languages_codes=program.languages
    )


@router()
def delete_message(
    program_id: QueryString,
    message_id: QueryString,
    user_email: str = get_current_user,
    # db: Session = get_db,
):
    check_user_access(user_email, program_id)
    DATABASE_URL = get_db_url()
    engine = create_engine(DATABASE_URL, echo=True)
    try:
        with engine.connect() as conn:
            conn.execute(text('DELETE FROM message_languages WHERE message_id = :message_id;'), {'message_id':message_id})
            conn.execute(text('DELETE FROM messages WHERE id = :message_id;'), {'message_id':message_id})
            conn.commit()
        return { "message": "Successfully delete" }
    except Exception as ex:
        return {"failure": str(ex)}




@router()
def update_multi_messages(
    program_id: Body,
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
