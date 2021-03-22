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
from deployments.controller import crud
from programs.controller import crud as programs_crud
from playlists.models import Playlist


@router()
def delete_deployment(
    program_code: QueryString,
    deployment_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_code)
    deployment = crud.get_by_multi(
        db=db, id=deployment_id, program_code=program_code
    )
    if not deployment:
        return NotFoundException("Deployment not found")

    program = programs_crud.get_by_program_code(
        db=db, program_code=program_code
    )
    programs_crud.update(
        db=db,
        db_obj=program,
        obj_in={'deployments_count': program.deployments_count - 1}
    )

    return crud.remove_by_id_and_code(
        db=db,
        id=deployment_id,
        program_code=program_code,
    )


@router()
def get_multi_deployments(
    program_code: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_code)
    return crud.get_multi_by_program_code(
        db=db, program_code=program_code, order=["id"]
    )


@router()
def update_multi_deployment(
    program_code: Body,
    deployments: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_code)
    results = []

    for deployment in deployments:
        db_deployment = crud.get_by_multi(
            db=db, id=deployment["id"], program_code=program_code
        )
        if not db_deployment:
            continue

        deployment_updated = crud.update(db=db, db_obj=db_deployment, obj_in=deployment)
        results.append(deployment_updated)

    return results
