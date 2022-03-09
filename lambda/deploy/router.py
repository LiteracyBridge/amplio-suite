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
from recipients.controller import crud as recipients_crud
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
    'format',
]
header_deplo: Final = [
    'project',
    'deployment_num',
    'startdate',
    'enddate',
    'component',
    'name',
]
header_recipients: Final = [
    'recipientid',
    'project',
    # 'partner',
    'communityname',
    'groupname',
    # 'affiliate',
    'component',
    'country',
    'region',
    'district',
    'numhouseholds',
    'numtbs',
    'supportentity',
    'listening_model',
    'language',
    'coordinates',
    'agent',
    'latitude',
    'longitude',
    'variant',
    'group_size',
    'deployments',
    'agent_gender',
    'direct_beneficiaries',
    'direct_beneficiaries_additional',
    'indirect_beneficiaries'
]


@router()
def lambda_handler(
    program_id: Body,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)

    print(f'deploy for {program_id}')

    # Generate the content.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_content, quoting=csv.QUOTE_NONNUMERIC)
    writer.writeheader()

    playlists = playlists_crud.get_multi_by_program_id(
        db=db, program_id=program_id, order=['deployment_id','position']
    )

    for playlist in playlists:
        deployment = deployments_crud.get(db=db, id=playlist.deployment_id)
        for message in playlist.messages:
            sdg_goal = ''
            if message.sdg_goal_id:
                sdg_goal = message.sdg_goal_id

            sdg_target = ''
            if message.sdg_target_id:
                sdg_target = f"{sdg_goal}-{message.sdg_target_id}"

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
                'format': message.format,
            }

            writer.writerow(row)

    save_to_csv(output.getvalue(), f"{program_id}/content.csv")

    # Generate the deployment_spec.csv file
    output =  io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_deplo)
    writer.writeheader()

    deployments = deployments_crud.get_multi_by_program_id(
        db=db, program_id=program_id
    )

    rows = [{
        'project': deployment.program_id,
        'deployment_num': deployment.number,
        'startdate': deployment.start_date.isoformat(),
        'enddate': deployment.end_date.isoformat(),
        'component': deployment.component,
        'name': f"{deployment.program_id}-{str(deployment.start_date.year)[2:]}-{deployment.number}"
    } for deployment in deployments]

    writer.writerows(rows)
    save_to_csv(output.getvalue(), f"{program_id}/deployment_spec.csv")

    # Generate the recipients.csv object in S3
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=header_recipients)
    writer.writeheader()

    recipients = recipients_crud.get_multi_by_program_id(db=db, program_id=program_id)
    rows = [{
        'recipientid' : recipient.id,
        'project' : recipient.program_id,
        # 'partner' : recipient.partner,
        'communityname' : recipient.community_name,
        'groupname' : recipient.group_name,
        # 'affiliate' : recipient.affiliate,
        'component' : recipient.component,
        'country' : recipient.country,
        'region' : recipient.region,
        'district' : recipient.district,
        'numhouseholds' : recipient.num_households,
        'numtbs' : recipient.num_tbs,
        'supportentity' : recipient.support_entity,
        'listening_model' : recipient.listening_model,
        'language' : recipient.language,
        'coordinates' : recipient.coordinates,
        'agent' : recipient.agent,
        'latitude' : recipient.latitude,
        'longitude' : recipient.longitude,
        'variant' : recipient.variant,
        'group_size' : recipient.group_size,
        'deployments' : recipient.deployments,
        'agent_gender' : recipient.agent_gender,
        'direct_beneficiaries' : recipient.direct_beneficiaries,
        'direct_beneficiaries_additional' : recipient.direct_beneficiaries_additional,
        'indirect_beneficiaries' : recipient.indirect_beneficiaries
    } for recipient in recipients]

    writer.writerows(rows)
    save_to_csv(output.getvalue(), f"{program_id}/recipients.csv")

    return {'message': 'Success'}
