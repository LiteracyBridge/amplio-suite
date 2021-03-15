from sqlalchemy.orm import Session

from db import get_db
from core.exceptions import NotFoundException
from core.decorators import check_user_access, format_request_response
from playlists.controller import crud
from deployments.controller import crud as deployment_crud


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code", "deployment_id"])
def create_playlist(event, context, db: Session):
    deployment = deployment_crud.get(db=db, id=event["deployment_id"])
    if not deployment:
        return NotFoundException("Deployment not found")

    playlist = {
        "program_code": deployment.program_code,
        "deployment_id": deployment.id,
    }

    return crud.create_playlist(db=db, obj_in=playlist)


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code", "playlist_id"])
def delete_playlist(event, context, db: Session):
    playlist = crud.get(db=db, id=event["playlist_id"])
    if not playlist:
        return NotFoundException("PLaylist not found")

    return crud.remove_by_id_and_code(
        db=db,
        id=event["playlist_id"],
        program_code=event["program_code"],
    )


@get_db()
@check_user_access()
@format_request_response(request_model=['program_code', 'deployment_id'])
def get_multi_playlists(event, context, db: Session):
    return crud.get_multi_playlists(
        db=db,
        program_code=event["program_code"],
        deployment_id=event["deployment_id"],
    )


@get_db()
@check_user_access()
@format_request_response(request_model=['playlists'])
def update_multi_playlists(event, context, db: Session):
    results = []
    for playlist in event["playlists"]:
        db_playlist = crud.get(db=db, id=playlist["id"])
        if not db_playlist:
            continue

        playlist_updated =  crud.update(
            db=db, db_obj=db_playlist, obj_in=playlist
        )
        results.append(playlist_updated)

    return results
