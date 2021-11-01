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
from playlists.controller import crud
from programs.controller import crud as programs_crud
from deployments.controller import crud as deployment_crud


@router()
def create_playlist(
    program_id: Body,
    deployment_id: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    program = programs_crud.get_by_program_id(
        db=db, program_id=program_id
    )
    deployment = deployment_crud.get_by_multi(
        db=db, id=deployment_id, program_id=program_id
    )
    if not deployment:
        return NotFoundException("Deployment not found")

    playlist = {
        "program_id": deployment.program_id,
        "deployment_id": deployment.id,
    }

    return crud.create_playlist(
        db=db, obj_in=playlist, languages_codes=program.languages
    )


@router()
def delete_playlist(
    program_id: QueryString,
    playlist_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    playlist = crud.get(db=db, id=playlist_id)
    if not playlist:
        return NotFoundException("PLaylist not found")

    return crud.remove_by_id_and_code(
        db=db,
        id=playlist_id,
        program_id=program_id,
    )


@router()
def get_multi_playlists(
    program_id: QueryString,
    deployment_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    return crud.get_multi_playlists(
        db=db,
        program_id=program_id,
        deployment_id=deployment_id,
    )


@router()
def update_multi_playlists(
    program_id: Body,
    playlists: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    results = []
    for playlist in playlists:
        db_playlist = crud.get(db=db, id=playlist["id"])
        if not db_playlist:
            continue

        playlist_updated =  crud.update(
            db=db, db_obj=db_playlist, obj_in=playlist
        )
        results.append(playlist_updated)

    return results
