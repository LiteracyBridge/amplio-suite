from sqlalchemy.orm import Session

from core.decorators import format_request_response
from db import get_db
from sustainable_developments import controller, schemas


@get_db()
@format_request_response(response_model=schemas.SustainableDevelopmentsGoal)
def get_sustainable_developments(even, context, db: Session):
    return controller.get_multi(db=db)
