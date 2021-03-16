from sqlalchemy.orm import Session

from db import get_db
from core.types import LambdaDict, LambdaContext
from core.exceptions import NotFoundException
from core.decorators import check_user_access, format_request_response
from deployments.controller import crud
from programs.controller import crud as programs_crud
from playlists.models import Playlist


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code", "deployment_id"])
def delete_deployment(event: LambdaDict, context: LambdaContext, db: Session):
    deployment = crud.get_by_multi(
        db=db, id=event["deployment_id"], program_code=event["program_code"]
    )
    if not deployment:
        return NotFoundException("Deployment not found")

    program = programs_crud.get_by_program_code(
        db=db, program_code=event["program_code"]
    )
    programs_crud.update(
        db=db,
        db_obj=program,
        obj_in={'deployments_count': program.deployments_count - 1}
    )

    return crud.remove_by_id_and_code(
        db=db,
        id=event["deployment_id"],
        program_code=event["program_code"],
    )


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code"])
def get_multi_deployments(event: LambdaDict, context: LambdaContext, db: Session):
    return crud.get_multi_by_program_code(
        db=db, program_code=event["program_code"], order=["number"]
    )


@get_db()
@check_user_access()
@format_request_response(request_model=["program_code", "deployments"])
def update_multi_deployment(event: LambdaDict, context: LambdaContext, db: Session):
    results = []

    for deployment in event["deployments"]:
        db_deployment = crud.get_by_multi(
            db=db, id=deployment["id"], program_code=event["program_code"]
        )
        if not db_deployment:
            continue

        deployment_updated = crud.update(db=db, db_obj=db_deployment, obj_in=deployment)
        results.append(deployment_updated)

    return results
