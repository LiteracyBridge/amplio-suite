from sqlalchemy.orm import Session

from core import (
    router,
    get_current_user,
    check_user_access,
    QueryString,
)
from db import get_db
from utils import TableManager
from core.config import settings, Environment
from projects import schemas
from projects.controller import crud


@router()
def create_project(
    project: schemas.ProjectCreate,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, project)
    return crud.create(db=db, obj_in=project)


@router()
def get_project(
    program_id: QueryString,
    user_email: str = get_current_user,
    db: Session = get_db,
):
    check_user_access(user_email, program_id)
    return crud.get_by_program_id(
        db=db, program_id=program_id
    )


@router()
def get_projects_by_user(user_email: str = get_current_user):
    if settings.ENVIRONMENT == Environment.DEVELOPMENT:
        print('Returning canned projects "TEST","TEST2","MY-TEST-8"')
        return {
  'MEDA': '*,AD,PM,CO,FO',
  'UNICEF-2': '*,AD,PM,CO,FO',
  'TS-NG-BWC': '*,AD,PM,CO,FO',
  'CBCC-RTI': '*,AD,PM,CO,FO',
  'UNICEF-KE-BIO': '*,AD,PM,CO,FO',
  'VSO-TALK-III': '*,AD,PM,CO,FO',
  'ILC-MW-R2R': '*,AD,PM,CO,FO',
  'VSO-TALK': '*,AD,PM,CO,FO',
  'XTEST': '*,AD,PM,CO,FO',
  'XTEST-BB-2': '*,AD,PM,CO,FO',
  'LANDESA-LR': '*,AD,PM,CO,FO',
  'CARE-ETH-BOYS': '*,AD,PM,CO,FO',
  'XTEST-2': '*,AD,PM,CO,FO',
  'XTEST-S3': '*,AD,PM,CO,FO',
  'UWR': '*,AD,PM,CO,FO',
  'LBG-APME_2A': '*,AD,PM,CO,FO',
  'TUDRIDEP': '*,AD,PM,CO,FO',
  'ITU-NIGER': '*,AD,PM,CO,FO',
  'BUSARA': '*,AD,PM,CO,FO',
  'DEMO': '*,AD,PM,CO,FO',
  'LANDESA-LR-LVG': '*,AD,PM,CO,FO',
  'UNICEFGHDF-MAHAMA': '*,AD,PM,CO,FO',
  'MC-NGA': '*,AD,PM,CO,FO',
  'XTEST-BB-4': '*,AD,PM,CO,FO',
  'UNICEF-ETH-P1': '*,AD,PM,CO,FO',
  'CARE-ETH-GIRLS': '*,AD,PM,CO,FO',
  'CARE-GH-COCOA': '*,AD,PM,CO,FO',
  'TPORTAL': '*,AD,PM,CO,FO',
  'LBG-DEMO': '*,AD,PM,CO,FO',
  'CARE-BGD-JANO': '*,AD,PM,CO,FO',
  'CARE-HTI': '*,AD,PM,CO,FO',
  'CARE-ETH-BIRHAN': '*,AD,PM,CO,FO',
  'CBCC': '*,AD,PM,CO,FO',
  'LBG-COVID19': '*,AD,PM,CO,FO',
  'XTEST-BB-1': '*,AD,PM,CO,FO',
  'XTEST-BB-3': '*,AD,PM,CO,FO',
  'CBCC-ATAY': '*,AD,PM,CO,FO',
  'SANDBOX': '*,AD,PM,CO,FO',
  'UNICEF-CHPS': '*,AD,PM,CO,FO',
  'XTEST-BB-5': '*,AD,PM,CO,FO',
  'AMPLIO-ED': '*,AD,PM,CO,FO',
  'CBCC-ANZ': '*,AD,PM,CO,FO',
  'TEST-TS-NG': '*,AD,PM,CO,FO',
  'NANDOM-NAP-GH': '*,AD,PM,CO,FO',
  'SSA-ETH': '*,AD,PM,CO,FO',
  'UNICEF-GH-CHPS': '*,AD,PM,CO,FO',
  'LBG-ESOKO': '*,AD,PM,CO,FO',
  'DEMO-DL': '*,AD,PM,CO,FO',
  'CBCC-AT': '*,AD,PM,CO,FO',
  'TEST': '*,AD,PM,CO,FO',
  'CARE': '*,AD,PM,CO,FO',
  'WKW-TLE': '*,AD,PM,CO,FO',
  'LBG-FL': '*,AD,PM,CO,FO',
  'ARM-DEMO': '*,AD,PM,CO,FO',
  'UNFM': '*,AD,PM,CO,FO',
  'INSTEDD': '*,AD,PM,CO,FO',
}

    manager = TableManager.get_instance()
    program_items = manager.get_programs_for_user(user_email).items()
    roles = {}
    for program, role in program_items:
        roles[program] = role

    print(f'Roles for {user_email} are {roles}')
    return roles
