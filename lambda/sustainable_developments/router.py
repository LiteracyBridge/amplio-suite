from sqlalchemy.orm import Session

from db import get_db
from core import router
from sustainable_developments import controller, schemas


@router(response_model=schemas.SustainableDevelopmentsGoal)
def get_sustainable_developments(db: Session = get_db()):
    return controller.get_multi(db=db)
