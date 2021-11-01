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
def create_deployments(
    deployments: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    for deployment in deployments:
        check_user_access(user_email, deployment)

    results = []
    for deployment in deployments:
        program = programs_crud.get_by_program_id(
            db=db, program_id=deployment["program_id"]
        )
        programs_crud.update(
            db=db,
            db_obj=program,
            obj_in={'deployments_count': program.deployments_count + 1}
        )

        db_deployment = crud.create_deployment(
            db=db,
            obj_in=deployment,
            languages_codes=program.languages,
        )
        results.append(db_deployment)

    return results


@router()
def get_deployments(
    program_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    return crud.get_multi_by_program_id(
        db=db, program_id=program_id, order=["id"]
    )


@router()
def update_deployments(
    deployments: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    for deployment in deployments:
        check_user_access(user_email, deployment)

    results = []
    for deployment in deployments:
        db_deployment = crud.get_by_multi(
            db=db, id=deployment["id"], program_id=deployment["program_id"]
        )
        if not db_deployment:
            continue

        deployment_updated = crud.update(db=db, db_obj=db_deployment, obj_in=deployment)
        results.append(deployment_updated)

    return results


@router()
def delete_deployments(
    program_id: QueryString,
    deployments_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)

    ids = []
    if deployments_id:
        ids = deployments_id.split(';')

    result = []
    for id in ids:
        deployment = crud.get_by_multi(
            db=db, id=id, program_id=program_id
        )
        if not deployment:
            return NotFoundException("Deployment not found")

        program = programs_crud.get_by_program_id(
            db=db, program_id=program_id
        )
        programs_crud.update(
            db=db,
            db_obj=program,
            obj_in={'deployments_count': program.deployments_count - 1}
        )

        deployment_remove = crud.remove_by_id_and_code(
            db=db,
            id=id,
            program_id=program_id,
        )
        result.append(deployment_remove)

    return result
