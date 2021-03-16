from sqlalchemy.orm import Session

from db import get_db
from core.types import LambdaDict, LambdaContext
from core.decorators import check_user_access, format_request_response
from core.exceptions import NotFoundException
from messages.controller import crud
from programs.controller import crud as programs_crud
from playlists.controller import crud as playlist_crud
from deployments.models import Deployment


@get_db()
@check_user_access()
@format_request_response(request_model=['program_code', 'playlist_id'])
def create_message(event: LambdaDict, context: LambdaContext, db: Session):
    program = programs_crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )
    playlist = playlist_crud.get(db=db, id=event["playlist_id"])
    if not playlist:
        raise NotFoundException(message="Playlist not found")

    message = {
        "program_code": playlist.program_code,
        "playlist_id": playlist.id,
    }
    return crud.create_message(
        db=db, obj_in=message, languages_codes=program.languages
    )


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code", "message_id"])
def delete_message(event: LambdaDict, context: LambdaContext, db: Session):
    return crud.remove_by_id_and_code(
        db=db,
        id=event["message_id"],
        program_code=event["program_code"],
    )


@get_db()
@check_user_access()
@format_request_response(request_model=["messages"])
def update_multi_messages(event: LambdaDict, context: LambdaContext, db: Session):
    results = []

    for message in event["messages"]:
        db_message = crud.get(db=db, id=message["id"])
        if not message:
            continue

        message_updated = crud.update_message(
            db=db, db_obj=db_message, obj_in=message
        )
        results.append(message_updated)

    return results
