import io
import csv
import json
from typing import Final

from sqlalchemy.orm import Session

from core import (
    router,
    get_current_user,
    check_user_access,
    Body,
)
from db import get_db
from utils import save_to_csv, user_programs
from deployments.controller import crud as deployments_crud
from playlists.controller import crud as playlists_crud
from projects.models import Project


header_content: Final = [
    'deployment_num',
    'playlist_title',
    'message_title',
    'key_points',
    'languagecode',
    'variant',
    'default_category',
    'sdg_goals',
    'sdg_targets',
]
header_deplo: Final = [
    'project',
    'deployment_num',
    'startdate',
    'enddate',
    'component',
    'name',
]


@router()
def lambda_handler(
    program_code: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_code)

    # Generate the content.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_content, quoting=csv.QUOTE_NONNUMERIC)
    writer.writeheader()

    playlists = playlists_crud.get_multi_by_program_code(
        db=db, program_code=program_code
    )

    for playlist in playlists:
        deployment = deployments_crud.get(db=db, id=playlist.deployment_id)
        for message in playlist.messages:
            sdg_goal = ''
            if message.sdg_goal_id:
                sdg_goal = message.sdg_goal.label

            sdg_target = ''
            if message.sdg_target_id:
                sdg_target = message.sdg_target.label

            category_name = ''
            if message.category:
                category_name = message.category.name

            row = {
                'deployment_num': deployment.number,
                'playlist_title': playlist.title,
                'message_title': message.title,
                'key_points': message.key_points,
                'languagecode': ','.join([lang.code for lang in message.languages]),
                'variant': message.variant,
                'default_category': category_name,
                'sdg_goals': sdg_goal,
                'sdg_targets': sdg_target,
            }

            writer.writerow(row)

    save_to_csv(output.getvalue(), f"{program_code}/content.csv")

    # Generate the deployment_spec.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_deplo)
    writer.writeheader()

    deployments = deployments_crud.get_multi_by_program_code(
        db=db, program_code=program_code
    )

    rows = [{
        'project': deployment.program_code,
        'deployment_num': deployment.number,
        'startdate': deployment.start_date.isoformat(),
        'enddate': deployment.end_date.isoformat(),
        'component': deployment.component,
        'name': f"{deployment.program_code}-{str(deployment.start_date.year)[2:]}-{deployment.number}"
    } for deployment in deployments]

    writer.writerows(rows)
    save_to_csv(output.getvalue(), f"{program_code}/deployment_spec.csv")

    return {'message': 'Success'}
